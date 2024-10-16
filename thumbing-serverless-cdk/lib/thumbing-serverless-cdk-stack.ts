import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
// import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
// import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';

dotenv.config();

export class ThumbingServerlessCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const frontendUrl: string = process.env.FRONTEND_URL as string;
    const gitpodFrontendUrl: string = process.env.GITPOD_FRONTEND_URL as string;
    const uploadsBucketName: string = process.env.UPLOADS_BUCKET_NAME as string;
    const assetsBucketName: string = process.env.ASSETS_BUCKET_NAME as string;
    const folderOutput: string = process.env.THUMBING_S3_FOLDER_OUTPUT as string;
    const webhookUrl: string = process.env.THUMBING_WEBHOOK_URL as string;
    const topicName: string = process.env.THUMBING_TOPIC_NAME as string;
    const functionPath: string = process.env.THUMBING_FUNCTION_PATH as string;
    console.log('frontendUrl', frontendUrl)
    console.log('gitpodFrontendUrl', gitpodFrontendUrl)
    console.log('uploadsBucketName', uploadsBucketName)
    console.log('assetsBucketName',assetsBucketName)
    console.log('folderOutput',folderOutput)
    console.log('webhookUrl',webhookUrl)
    console.log('topicName',topicName)
    console.log('functionPath',functionPath)

    const uploadsBucket = this.createBucket(uploadsBucketName, frontendUrl, gitpodFrontendUrl);
    const assetsBucket = this.importBucket(assetsBucketName);

    // create a lambda
    const lambda = this.createLambda(
      functionPath,
      assetsBucketName,
      folderOutput
    );

    // create topic and subscription
    // const snsTopic = this.createSnsTopic(topicName)
    // this.createSnsSubscription(snsTopic,webhookUrl)

    // add our s3 event notifications
    this.createS3NotifyToLambda(lambda, uploadsBucket)
    // this.createS3NotifyToSns(folderOutput,snsTopic,assetsBucket)

    // create policies
    const s3UploadsReadWritePolicy = this.createPolicyBucketGetAccess(uploadsBucket.bucketArn)
    const s3AssetsReadWritePolicy = this.createPolicyBucketPutAccess(assetsBucket.bucketArn)
    //const snsPublishPolicy = this.createPolicySnSPublish(snsTopic.topicArn)

    // attach policies for permissions
    lambda.addToRolePolicy(s3UploadsReadWritePolicy);
    lambda.addToRolePolicy(s3AssetsReadWritePolicy);
    //lambda.addToRolePolicy(snsPublishPolicy);
  }

  createBucket(bucketName: string, frontendUrl: string, gitpodFrontendUrl: string): s3.IBucket {
    const bucket = new s3.Bucket(this, 'UploadsBucket', {
      bucketName: bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedHeaders: [
            "*"
          ],
          allowedMethods: [
            s3.HttpMethods.PUT
          ],
          allowedOrigins: [
            frontendUrl,
            gitpodFrontendUrl
          ],
          exposedHeaders: [
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2"
          ],
          maxAge: 3000
        }
      ],
    });
    return bucket;
  }

  importBucket(bucketName: string): s3.IBucket {
    const bucket = s3.Bucket.fromBucketName(this, "AssetsBucket", bucketName);
    return bucket;
  }

  createLambda(functionPath: string, assetsBucketName: string, folderOutput: string): lambda.IFunction {
    const lambdaFunction = new NodejsFunction(this, 'ThumbLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: functionPath + '/index.js',
      handler: 'handler',
      bundling: {
        nodeModules: ['sharp'],
      },
      environment: {
        DEST_BUCKET_NAME: assetsBucketName,
        FOLDER_OUTPUT: folderOutput,
        PROCESS_WIDTH: '512',
        PROCESS_HEIGHT: '512'
      },
    });
    return lambdaFunction;
  } 

  createS3NotifyToLambda(lambda: lambda.IFunction, bucket: s3.IBucket): void {
    const destination = new s3n.LambdaDestination(lambda);
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      destination
    )
  }

  createPolicyBucketGetAccess(bucketArn: string){
    const s3Policy = new iam.PolicyStatement({
      actions: [
        's3:GetObject',
      ],
      resources: [
        `${bucketArn}/*`,
      ]
    });
    return s3Policy;
  }

  createPolicyBucketPutAccess(bucketArn: string){
    const s3Policy = new iam.PolicyStatement({
      actions: [
        's3:PutObject',
      ],
      resources: [
        `${bucketArn}/*`,
      ]
    });
    return s3Policy;
  }

  // createSnsTopic(topicName: string): sns.ITopic{
  //   const logicalName = "ThumbingTopic";
  //   const snsTopic = new sns.Topic(this, logicalName, {
  //     topicName: topicName
  //   });
  //   return snsTopic;
  // }

  // createSnsSubscription(snsTopic: sns.ITopic, webhookUrl: string): sns.Subscription {
  //   const snsSubscription = snsTopic.addSubscription(
  //     new subscriptions.UrlSubscription(webhookUrl)
  //   )
  //   return snsSubscription;
  // }

  // createS3NotifyToSns(prefix: string, snsTopic: sns.ITopic, bucket: s3.IBucket): void {
  //   const destination = new s3n.SnsDestination(snsTopic)
  //   bucket.addEventNotification(
  //     s3.EventType.OBJECT_CREATED_PUT, 
  //     destination,
  //     {prefix: prefix}
  //   );
  // }

  /*
  createPolicySnSPublish(topicArn: string){
    const snsPublishPolicy = new iam.PolicyStatement({
      actions: [
        'sns:Publish',
      ],
      resources: [
        topicArn
      ]
    });
    return snsPublishPolicy;
  }
  */
}