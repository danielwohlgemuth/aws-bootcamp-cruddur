# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy

Week 9 was a short week as it only involved setting up a CI/CD pipeline.

The pipeline has 3 stages:
- Source
- Build
- Deploy

The pipeline starts to run when a pull request gets merged into the `prod` branch on GitHub.

The `Source` stage then bundles the source code into a zip file and uploads it as an artifact to an S3 bucket.

The `Build` stage uses the uploaded artifact to build a container image and pushes it to the Elastic Container Registry.

The `Deploy` stage signals the Elastic Container Service to update the service, which causes it to pull the latest container image.

AWS CodePipeline configuration for the backend

![aws codepipeline](/journal/assets/week9/aws-codepipeline.png)

CI/CD Pipeline Architecture

![ci/cd pipeline architecture diagram](/journal/assets/week9/ci-cd-pipeline.png)

[CI/CD Pipeline Architecture diagram file](https://app.diagrams.net/?title=ci-cd-pipeline#Uhttps%3A%2F%2Fraw.githubusercontent.com%2Fdanielwohlgemuth%2Faws-bootcamp-cruddur%2Frefs%2Fheads%2Fmain%2Fjournal%2Fassets%2Fweek9%2Fci-cd-pipeline.drawio)
