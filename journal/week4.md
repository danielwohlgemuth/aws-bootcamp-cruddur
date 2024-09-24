# Week 4 — Postgres and RDS

This week we set up the database for Cruddur. We use [Amazon RDS](https://aws.amazon.com/rds/) for this with the PostgreSQL engine.

## Configure Amazon RDS 

The database was set up from the command line to have it configured in a consistent way. It was noted several times during the course that the AWS UI changes frequently, so this approach should help avoid spending time figuring out how to set it up after each UI update. Two pieces of information necessary to set up the database through the command line were the availability zone in which the database will be created and the version of the database engine to use.

To get the list of availability zone, this command was used:

```bash
aws ec2 describe-availability-zones --region us-east-1 | jq '.AvailabilityZones[].ZoneName'
```

To get the list of RDS engine versions, this command was helpful:

```bash
aws rds describe-db-engine-versions --engine postgres | jq '.DBEngineVersions[].EngineVersion'
```

With the information from the two previous commands, the following command was used to set up the database:

```bash
aws rds create-db-instance \
  --db-instance-identifier cruddur-db-instance \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16.3 \
  --master-username DB_USERNAME_HERE \
  --master-user-password DB_PASSWORD_HERE \
  --allocated-storage 20 \
  --availability-zone us-east-1a \
  --backup-retention-period 0 \
  --port 5432 \
  --no-multi-az \
  --db-name cruddur \
  --storage-type gp2 \
  --publicly-accessible \
  --storage-encrypted \
  --no-enable-performance-insights \
  --no-deletion-protection
```

![aws rds database](/journal/assets/week4/aws-rds-database.png)

## Cognito Post Confirmation Lambda Trigger

To get the user information into the database, a post confirmation Lambda trigger was configured in Cognito. As the name suggests, this Lambda function runs after the user has completed the confirmation step in the sign-up flow.

![aws cognito user pool lambda trigger](/journal/assets/week4/aws-cognito-user-pool-lambda-trigger.png)

What the Lambda function does is take the name, email, username, and Cognito user id, connect to the database and insert the user details as a new row.

## Psycopg 2 Lambda Layer

One of the challenges to get the Lambda Python function to connect to the PostgreSQL database was the use of the Psycopg 2 library. It's not possible to use the library directly due to Lambda missing the required PostgreSQL libraries in the AMI image, but there are workarounds to make it work. I found [this answer](https://stackoverflow.com/a/74729370) on Stack Overflow which helped me create a set of commands to upload a Lambda layer I could use in the Lambda function.

Here are the commands to create a Lambda layer which includes Psycopg 2. I also bundled them into the [create-psycopg2-layer.sh](/aws/lambdas/create-psycopg2-layer.sh) script for convenience.

```bash
pip install \
    --target=python \
    --python-version 3.12 \
    --platform manylinux2014_x86_64 \
    --implementation cp \
    --only-binary=:all: \
    --upgrade \
    psycopg2-binary

zip -r psycopg2.zip python

aws lambda publish-layer-version \
    --layer-name psycopg2 \
    --compatible-runtimes python3.12 \
    --compatible-architectures x86_64 \
    --zip-file fileb://psycopg2.zip

rm -r python
rm -r psycopg2.zip
```

## First User in the Database

After the database and the Lambda function were set up, any new users that signed up were registered in the database.

New user in Cognito.

![aws cognito new user](/journal/assets/week4/aws-cognito-new-user.png)

The new user in the RDS database, in addition to the two users from the seed data.

![aws rds new user record](/journal/assets/week4/aws-rds-new-user-record.png)

First user with a database record making a post. Notice that the attribution on the post is not correct yet. It says Andrew Brown when it should be Re Bar. Something to improve in the future.

![cruddur first crud](/journal/assets/week4/cruddur-first-crud.png)

## Grant Gitpod Access to RDS

While the database is running on RDS, the frontend and backend are still running on Gitpod. To make the database accessible to the backend it needed to be exposed. Since this is a security risk, an additional step needed to be taken to secure it.

The [rds-update-sg-rule](/backend-flask/bin/rds-update-sg-rule) script was created to update a security group rule to limit external access to the database port to the IP of the Gitpod instance. Since the Gitpod IP can change each time a new environment is launched, [ifconfig.me](https://ifconfig.me/) is used to determine the current IP of the Gitpod instance before updating the security rule group.

Security Group Rule after running the `rds-update-sg-rule` script.

![aws rds security group rule update](/journal/assets/week4/aws-rds-security-group-rule-update.png)

## Zero-Spend Budget Alert

This week was the first time the Zero-Spend Budget alert was triggered to send an email.

After looking at the bill details in AWS Billing and Cost Management, it turns out to be because of a public IP v4 address.

![aws billing detail](/journal/assets/week4/aws-billing-detail.png)

It is a new charge that has been [introduced in February 1, 2024](https://aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/). It now costs $0.005 per hour to have a public IPv4 address.

The [Amazon VPC](https://aws.amazon.com/vpc/) service has a feature called [IP Address Manager](https://aws.amazon.com/vpc/features/#product-features#vpc-virtual-private-cloud-features#ip-address-manager-ipam) which allowed me to see the IPs that were in use. The free tier of this service only covers a single region which is enough for our use case.

![aws vpc ipam](/journal/assets/week4/aws-vpc-ipam.png)

I had the suspicion that exposing the database is what caused the charge. Clicking on the network interface link from the IP Address Manager confirmed that.

![aws ec2 network interface](/journal/assets/week4/aws-ec2-network-interface.png)

The ideal solution would be to avoid using an IP v4 address when exposing the database. Unfortunately, the network type that can be specified when creating the database only allows `IPV4` and `DUAL` (IPv4 + IPv6), so there is no IPv6-only option. The other bad news is that a database can only be stopped temporarily for 7 days. After 7 days, it starts automatically and will start getting charged again for using an IPv4 address, so it needs to be monitored to avoid overspending because of it.
