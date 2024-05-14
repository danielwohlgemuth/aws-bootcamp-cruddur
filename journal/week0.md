# Week 0 — Billing and Architecture

The AWS Cloud Project Bootcamp Course was led by Andrew Brown in 2023. The course was 14 weeks long and was created to prepare for an AWS role after passing the AWS Solutions Architect Associate certification exam by getting practical experience with the different AWS services.

The course is available as a single Youtube video under the name of [AWS Cloud Complete Bootcamp Course](https://www.youtube.com/watch?v=zA8guDqfv40) on the [freeCodeCamp.org](https://www.youtube.com/@freecodecamp) channel.

The course outline is available at [AWS Cloud Project Bootcamp Outline](https://docs.google.com/document/d/19XMyd5zCk7S9QT2q1_Cg-wvbnBwOge7EgzgvtVCgcz0/edit).

Week 0 (classic programmer starting number) goes over the course structure, explains what the project is about, and goes through the prerequisites.

## What is the project about?

The project is about building a platform called Cruddur. It's a micro-blogging platform with ephemeral posts, so it's similar to X (Twitter) but posts expire and disappear after a configured time.

## Prerequisites

A number of accounts are expected to be created to be used during the course. All of the accounts have a free tier which should be enough to go through the course with minimal or no spend.

The accounts that were created:
- GitHub
- Gitpod
- Github Codespaces
- AWS
- Momento
- Lucidchart
- Honeycomb
- Rollbar

### GitHub

[GitHub](https://github.com/) will be used as the code repository of the project. The first step after creating an account was to create a fork from [https://github.com/ExamProCo/aws-bootcamp-cruddur-2023](https://github.com/ExamProCo/aws-bootcamp-cruddur-2023) as the starting point.

### Gitpod

[Gitpod](https://www.gitpod.io/) is a Cloud Developer Environment (CDE). It's like a VS Code which you can use from a browser. It starts a pre-configured dev environment which can be used to have a consistent environment to develop the project.
The [Gitpod extension](https://chromewebstore.google.com/detail/gitpod/dodmmooeoklaejobgleioelladacbeki) for Chrome/Chromium-based browsers adds a button to projects on GitLab, GitHub, and Bitbucket to easily spin up a dev environment with a single click.

### Github Codespaces

[Github Codespaces](https://github.com/features/codespaces/) is an alternative Cloud Developer Environment like Gitpod. It will serve as a backup to use once the credits on Gitpod have been used up.

### AWS

[AWS](https://aws.amazon.com/) will be used to host most of the services used to run the system.

A new AWS account was created for this course. AWS accounts include a [free tier](https://aws.amazon.com/free/), where some of the features are always free, some for 12 months since account creation, and some for a limited time after activating the feature.

### Momento

[Momento](https://www.gomomento.com/) offers a cache service to improve performance and keep costs down.

### Lucidchart

[Lucidchart](https://www.lucidchart.com/pages/) is a diagramming application that will be used to create the system architecture diagrams.

### Honeycomb

[Honeycomb](https://www.honeycomb.io/) is an observability and application performance management (APM) platform used to monitor and troubleshoot the services of the system.

### Rollbar

[Rollbar](https://rollbar.com/) is a bug tracking tool that can capture application crashes, uncaught errors, and slow response to make it easy to debug services.

## AWS Account Setup

After the AWS account was created, several steps were taken to set it up for the course, including configuring MFA, creating an admin user, setting up the AWS CLI, and creating billing and budget alerts. 

### Multi-factor Authentication (MFA)

The very first step after creating an AWS account should be to secure the root user account (the user that opened the AWS account) by setting up multi-factor authentication (MFA) to make it harder for the account to be compromised. This can be done by clicking on the user name at the top right corner and selecting `Security credentials`.

![Security credentials](/journal/assets/week0/iam-security-credentials.png)

Clicking on the `Assign MFA device` button leads to a screen where the device name can be entered and a choice option between three MFA setup paths.

The MFA options are: 
- Authenticator app like Google Authenticator, Microsoft Authenticator, or Twilio Authy Authenticator
- Security Key like YubiKey or other supported FIDO security keys
- Hardware TOTP token

### Admin User

The second step when setting up an AWS account is to create an admin user to limit the usage of the root user to actions that can't be performed by other users.

For this step, a user was created in the Identity and Access Management (IAM) service and assigned to the `Admin` group which included the `AdministratorAccess` permission policy.

![Admin user](/journal/assets/week0/iam-admin-user.png)

### Command Line Interface (CLI)

A good next step is to set up a spending budget and billing alerts to be notified when the cost of resource usage went over an expected amount.

This can be done through the UI as well as with the command line interface (CLI). Doing it through the CLI can be done in two ways. The easier option is to use CloudShell, a browser-based command line that is already connected to the account. The other option is to install the AWS CLI on a machine and configure the required credentials to get access to the AWS account.

A good sanity-check command that can tell if the command line is set up correctly is `aws sts get-caller-identity`. If everything went well, it should show the AWS account Id.

![CloudShell](/journal/assets/week0/cloudshell.png)

Installing the AWS CLI on a machine takes a few more steps. It can be installed by following the steps in the [install guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

To make the AWS CLI become preinstalled when launching a Gitpod instance, the `aws-cli` task was added to the `.gitpod.yml` file of this project.

In order to use the AWS CLI, an access key needs to be created and the CLI needs to be configured to use it. The access key can be created by clicking on the user name at the top right corner and selecting `Security credentials`. Then click the `Create access key` button and choose the `Command Line Interface (CLI)` use case. This generates an access key and a secret access key. The secret access key needs to be stored in a secure place for later use.

![Admin user](/journal/assets/week0/iam-access-key.png)

Configuring the AWS CLI to use those credentials can be done by running the `aws configure` command and it prompts the user to enter the access key, secret access key, and region.
Alternatively, the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_DEFAULT_REGION` environment variables can be set, as described in the [AWS CLI Environment variables configuration guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html#envvars-set).

Gitpod has a convenient command to preserve environment variables across restarts of the developer environment. It looks like this: `gp env AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE`. The access key value is an example from the AWS CLI documentation.

![Gitpod CLI](/journal/assets/week0/gitpod-cli.png)

### Budget and Billing Alerts

Setting up a budget can be done from the Budget side-menu in the Billing and Cost Management service with an option to choose between simplified templates and customized budgets. The Zero spend budget template is perfect for this project as it notifies once the spending exceeds $0.01. Creating this budget consumes one of the two budgets available for free.

![Budget](/journal/assets/week0/billing-budget.png)

Another way to define a budget is through the CLI using the `aws budgets create-budget` command. The complete command would be this:

```bash
aws budgets create-budget \
    --account-id $AWS_ACCOUNT_ID \
    --budget file://aws/json/budget.json \
    --notifications-with-subscribers file://aws/json/budget-notifications-with-subscribers.json
```

The `budget.json` file holds the budget definition and the `budget-notifications-with-subscribers.json` file defines when the notification should trigger and who should receive it.

Since the Zero spend budget is already set up, I removed this budget with:

```bash
aws budgets delete-budget \
    --account-id $AWS_ACCOUNT_ID \
    --budget-name "Example Tag Budget"
```

Another way to keep an eye on spending is to set up a CloudWatch billing alarm. The steps are:
- Create an SNS topic
- Subscribe to the SNS topic
- Create a CloudWatch alarm with the SNS topic as the action target

The command to create the SNS topic is `aws sns create-topic --name billing-alarm`.

After that, it's possible to subscribe to the SNS topic with:

```bash
aws sns subscribe \
    --topic-arn "arn:aws:sns:us-east-1:***0189:billing-alarm" \
    --protocol email \
    --notification-endpoint example@example.com.invalid
```

Note that the email specified in the `--notification-endpoint` parameter will receive an email to confirm that it's an actual address and has opted into the notification.

Finally, the CloudWatch alarm can be configured with:

```bash
aws cloudwatch put-metric-alarm --cli-input-json file://aws/json/alarm-config.json
``` 

![CloudWatch Billing Alarm](/journal/assets/week0/cloudwatch-billing-alarm.png)

## Architecture Diagrams

### Conceptual Architecture Diagram

The conceptual or napkin architecture diagram serves as a high-level overview of the system to give an idea of how it will be structured.

![Conceptual Architecture Diagram](/journal/assets/week0/Cruddur_-_Conceptual_Architecture_Diagram.png)

### Logical Architecture Diagram

The logical architecture diagram takes the conceptual diagram and replaces the generic services (Router) with the actual names of the services to be used (Route 53). The next step would be to create a physical architecture diagram, which would be more specific in naming the resources inside of each service compared to the logical diagram.

![Logical Architecture Diagram](/journal/assets/week0/Cruddur_-_Logical_Architecture_Diagram.png)

[Conceptual and logical architecture diagram](https://lucid.app/lucidchart/0cd3494f-986d-429b-8b3d-e33d52e3f35a/edit?invitationId=inv_a61d5454-b455-46c7-b88d-87d911d90865) on Lucidchart.

### Conceptual CI/CD Diagram

The conceptual CI/CD diagram was done as an unguided exercise to practice with the diagramming app.

![Conceptual CI/CD Diagram](/journal/assets/week0/Cruddur_-_Conceptual_CI_CD_Diagram.png)

### Logical CI/CD Diagram

The logical CI/CD diagram is a best-effort work and probably not accurate, so it might need to be reviewed later.

![Logical CI/CD Diagram](/journal/assets/week0/Cruddur_-_Logical_CI_CD_Diagram.png)

[Conceptual and logical CI/CD diagram](https://lucid.app/lucidchart/4c61218f-80b1-495a-a0b9-f0049c85faf4/edit?invitationId=inv_96522fa0-ed07-4a3c-a538-ae32e95c30d9) on Lucidchart.

## Security

### CloudTrail trails

Trails in CloudTrail send AWS account activity to S3 buckets for security monitoring. A single trail can be configured for free. S3 costs also need to be considered. The free tier includes 5 GB of storage on S3 for the first 12 months since account creation. 

### BFG Repo-Cleaner

It's a best practice to not commit sensitive data like access keys into the file version history and instead store them in environment variables or in files explicitly excluded from version control.

At some point during the course of week 0, the account Id was committed to the repository. It's not very sensitive information but it could be abused to redirect traffic to the AWS account and impact the budget.

There is a tool called [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) which can be used to remove sensitive information from the repository.

It took several steps to get the account Id removed. The first step was to create a new commit with the account Id redacted to `***0189` in the `alarm-config.json` file.

After that, bfg needs to be told what sensitive data it should look for as well as the repository in which to search and replace. The replacement value that bfg uses is `***REMOVED***`. After bfg is done, the repo needs to be pushed and with that the sensitive values should be gone from the history.

Note that using bfg is considered a dangerous operation because it could destroy the content of the repository if something goes wrong.

The commands to do all those steps are here:

```bash
# Assuming these steps are run inside Gitpod
cd /workspace
# The latest bfg version can be found at https://rtyley.github.io/bfg-repo-cleaner/
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
git clone --mirror https://github.com/danielwohlgemuth/aws-bootcamp-cruddur-2023.git aws-bootcamp
# Create the sensitive.txt file and add the account Id to it
# Gitpod includes support for several languages, including Java. No need to install it. 
java -jar bfg-1.14.0.jar --replace-text sensitive.txt aws-bootcamp
cd aws-bootcamp
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push
cd $THEIA_WORKSPACE_ROOT
```

The result after running the previous commands. `***0189` was the change I made to remove the complete account Id from the latest commit. `***REMOVED***` was previously the account Id which is what bfg replaced.

![Sensitive data removed with BFG](/journal/assets/week0/sensitive-data-removed-with-bfg.png)

### TruffleHog

[TruffleHog](https://trufflesecurity.com/trufflehog) is a secrets scanning tool that digs deep into code repositories to find secrets, passwords, and sensitive keys.

It can be installed in Gitpod with `brew install trufflehog`.

To run it against a repository, the following command can be used:

```bash
trufflehog github --repo https://github.com/danielwohlgemuth/aws-bootcamp-cruddur-2023
```

No secrets were found after running the previous command.

![TruffleHog](/journal/assets/week0/trufflehog.png)
