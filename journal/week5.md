# Week 5 — DynamoDB and Serverless Caching

The main topic of week 5 was implementing the use of DynamoDB for messages. The initial plan was to include serverless caching with Momento but that didn't happen because of time constraints.

![cruddur messages](/journal/assets/week5/cruddur-messages.png)

A new DynamoDB table called `cruddur-messages` was created. It's used to store the message information. The partition key has either the `GRP` or `MSG` prefix and is the main field to search for records. `GRP` represents a group of messages to be used in the overview section of the messages page. `MSG` represents each individual message in a conversation. The sort key is the date/time of the message in ISO format and is used as a secondary field to narrow down the results when searching the records.

Group Message record

![dynamodb group messages](/journal/assets/week5/dynamodb-group-messages.png)

> The `message` field could be used to show the latest message in a conversation with another user. For now, it's showing the first message of that conversation. The `message_group_id` field holds the Id value with which the individual messages of the conversation can be retrieved.

Message record

![dynamodb messages](/journal/assets/week5/dynamodb-messages.png)

> The message group Id is included in the partition key to allow fast retrieval of all the messages that are part of the same message group/conversation.

## DynamoDB Stream

The Stream feature of DynamoDB was enabled on the `cruddur-messages` table to trigger a Lambda function that rewrites the sort key value into a consistent format.

![aws dynamodb stream](/journal/assets/week5/aws-dynamodb-stream.png)

## Scripts

New scripts to interact with DynamoDB were introduced. To make the scripts more manageable, they were reorganized into one folder per service.

![scripts](/journal/assets/week5/scripts.png)

## Free Tier Limit

During this week, I received an email warning me that my account was nearing the 2000 S3 requests limit that is available as part of the free tier. I didn't find a specific service responsible for that usage, but CloudTrail was most likely making those requests because that was the only service using S3 so far, so I disabled trail logging in CloudTrail to avoid going over the limit.

![aws s3 free tier limit](/journal/assets/week5/aws-s3-free-tier-limit.png)
