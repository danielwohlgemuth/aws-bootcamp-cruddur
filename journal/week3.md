# Week 3 — Decentralized Authentication

In week 3 we implemented authentication using [Amazon Cognito](https://aws.amazon.com/cognito/). Cognito is an identity and access management service which offers a set of APIs that can be used to allow users to self-register to an app. Once registered, users can be managed from Cognito to reset their password or disable their access.

To start using Cognito, a user pool needs to be created. Configuration like required fields (email, username, and name) and multi-factor authentication (MFA) options are defined at creation, some of which can't be changed later and a new pool needs to be created if thats needed.

![amazon cognito user pool](/journal/assets/week3/amazon-cognito-user-pool.png)

List of users in Cognito.

![amazon cognito users](/journal/assets/week3/amazon-cognito-users.png)

View of an individual user in Cognito with options to reset the password or disable access.

![amazon cognito user options](/journal/assets/week3/amazon-cognito-user-options.png)

To interact with the Cognito API, [AWS Amplify](https://aws.amazon.com/amplify/) was used. Amplify offers a set of libraries that can be used to simplify authentication with Cognito, among other things.

The course had been made with an earlier version of the Amplify library, so the [migration guide from v5 to v6](https://docs.amplify.aws/gen1/javascript/build-a-backend/auth/auth-migration-guide/) was useful to bring the project up to date.

Using a temporary email service, I tested the sign-up flow to make sure all paths worked correctly. This was the result after signing in with one of the test users. Notice the name and user name in the lower left side.

![cruddur signed in homepage](/journal/assets/week3/cruddur-signed-in-homepage.png)

The default validation messages from Amplify were also reviewed and improved where necessary to provide a better experience. This one would have said "password is required to signUp" instead of "Password is required.".

![cruddur sign in validation](/journal/assets/week3/cruddur-sign-in-validation.png)
