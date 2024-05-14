# Week 1 — App Containerization

In week 1, the main topic was Docker and how to package up the services to make them portable to run across different environments. A small part was also dedicated to familiarize with the frontend and backend by implementing the notification functionality.

![Frontend Notifications](/journal/assets/week1/frontend-notifications.png)

There are two main concepts when packaging up applications with Docker: images and containers.
Images are like templates of the application which include the application in a form that is ready to run and also include the operating system tools needed to make it work.
When the image is used to run the application, it becomes a container which runs the application in an isolated environment by default for improved security and portability.

## Docker

### Docker Commands

Here follows a list of commands used to interact with containers and container images.

Build the backend image and tag it as `backend-flask`.
```bash
docker build -t backend-flask ./backend-flask
```

Run backend, removing the container after it stops, expose port `4567`, and pass in environment variables.
```bash
docker run --rm -p 4567:4567 -it -e FRONTEND_URL="*" -e BACKEND_URL="*" backend-flask
```

In Gitpod, the ports need to be made public to be able to use them. This can be done by clicking the lock icon in the `PORTS` tab.

![Gitpod ports](/journal/assets/week1/gitpod-ports.png)

The API results of the backend can be accessed at the URL for the port `4567` and by appending the path `/api/activities/home`.

![Backend API](/journal/assets/week1/backend-api.png)

Build the frontend image and tag it as `frontend-react-js`.
```bash
docker build -t frontend-react-js ./frontend-react-js
```

Run frontend, removing the container after it stops, expose port `3000`, and pass in environment variables.
```bash
docker container run --rm -p 3000:3000 -e REACT_APP_BACKEND_URL="https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}" -it frontend-react-js
```

![Frontend UI](/journal/assets/week1/frontend-ui.png)

List running containers.
```bash
docker ps
```

![docker ps](/journal/assets/week1/docker-ps.png)

List containers, even stopped ones.
```bash
docker ps -a
```

![docker ps -a](/journal/assets/week1/docker-ps-a.png)

Show container logs in follow mode.
```bash
docker logs CONTAINER_ID_HERE -f
```

Gain access to a container.
```bash
docker exec -it CONTAINER_ID_HERE /bin/bash
```

Stop a container.
```bash
docker stop CONTAINER_ID_HERE
```

Remove a container that wasn't started with the `--rm` flag.
```bash
docker rm CONTAINER_ID_HERE
```

List container images.
```bash
docker image ls
```

![Backend API](/journal/assets/week1/docker-image-ls.png)

Remove container image.
```bash
docker image rm IMAGE_NAME_HERE
```

### Docker Hub

To make images available to be used on other machines, they can be pushed to a container registry. The official one is Docker Hub. There is also one on AWS called Amazon Elastic Container Registry (ECR).

Container images can be pushed to Docker Hub by adding the username as a prefix of the build tag. 
```bash
docker build -t danielwohlgemuth/backend-flask ./backend-flask
docker build -t danielwohlgemuth/frontend-react-js ./frontend-react-js
```

The images can then be pushed to Docker Hub.
```bash
docker build -t danielwohlgemuth/backend-flask ./backend-flask
docker build -t danielwohlgemuth/frontend-react-js ./frontend-react-js
```

![Backend API](/journal/assets/week1/docker-hub.png)

### Docker Compose

Docker compose extends Docker to make it easier to start and stop several services at once by using the `docker-compose.yml` file as a configuration file with the default settings for each service.

Run frontend and backend with docker compose.
```bash
docker compose up
```

Remove all the resources (except volumes) created by `docker compose up`.
```bash
docker compose down
```

Note that in the `docker-compose.yml` file, both the frontend and backend volumes map the respective project folders into the container. This is convenient during development to have changes on the files be reflected immediately in each service. The drawback of this is that for the frontend it means that the dependencies need to be installed locally for it to work.

Another thing to point out about the `docker-compose.yml` file is that there are two styles to define the environment variables: as a list or as key-value pairs. The styles can't be mixed, so all environment variables need to be defined either as lists or as key-value pairs.

Environment variables defined as a list.
```yaml 
    environment:
      - "REACT_APP_BACKEND_URL=https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
```

Environment variables defined as key-value pairs.
```yaml
    environment:
      REACT_APP_BACKEND_URL: "https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
```

I figured that out because I had it defined as shown below, which broke the frontend because the quote (`"`) was interpreted as part of the value. `REACT_APP_BACKEND_URL` ended up as `"https://4567-***.gitpod.io"` instead of `https://4567-***.gitpod.io`.
```yaml
    environment:
        - REACT_APP_BACKEND_URL="https://4567-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
```

### Docker Best Practices

Reading through the [Docker guidelines](https://docs.docker.com/develop/develop-images/guidelines/) and [best practices](https://docs.docker.com/develop/develop-images/instructions/) I found that adding a `.dockerignore` file to the frontend and backend was the most applicable advice to follow. Adding that file should help keep the image build step fast by reducing the amount of context information that Docker tries to use. This is especially noticeable in the frontend build where copying over the node_modules folder with all dependencies took some time and was unnecessary because the dependencies are installed again anyway as part of the build process.

### VS Code Docker Extension

The Docker extension for VS Code has some useful features to interact with containers, including the option to attach to a running container and inspect it or to push an image to the Docker Hub container registry.

![Backend API](/journal/assets/week1/docker-postgres-attach-shell.png)

## AWS EC2

A challenge of this week was to run the service in containers on an AWS EC2 instance.

The selected instance type was `t2.micro` and the Amazon Machine Image (AMI) was `Amazon Linux 2023 AMI`, both included in the free tier. A security group was also defined to expose the frontend UI on port `3000`, the backend API on port `4567`, and SSH access on port `22`.

![EC2 Security Group](/journal/assets/week1/ec2-security-group.png)

Docker needed to be installed on the machine with these commands.
```bash
sudo yum update -y
sudo yum install docker
sudo service docker start
sudo usermod -a -G docker ec2-user
```

The containers were then started as background processes.
```bash
docker container run --rm -p 4567:4567 -it -e FRONTEND_URL="*" -e BACKEND_URL="*" -d danielwohlgemuth/backend-flask
docker container run --rm -p 3000:3000 -e REACT_APP_BACKEND_URL="http://ec2-***.compute-1.amazonaws.com:4567" -it -d danielwohlgemuth/frontend-react-js
```

![EC2 SSH](/journal/assets/week1/ec2-ssh.png)

Cruddur running in containers in an EC2 instance.

![EC2 Frontend UI](/journal/assets/week1/ec2-frontend-ui.png)

## Security

[Snyk](https://snyk.io/) is a cybersecurity company which offers a product called [Snyk Open Source](https://snyk.io/product/open-source-security-management/) that allows scanning a project and report the vulnerabilities it finds.

The initial scan of the project returned 16 critical vulnerabilities.

![Snyc scan](/journal/assets/week1/snyc-scan.png)

Most of the vulnerabilities could be addressed by updating the base container images.

Some of the vulnerabilities were part of the dependencies. Several of the frontend vulnerabilities could be addressed with these steps.

Manually update the packages to the highest non-breaking change.
```bash
npm outdated
```

Update the `package-lock.json` file.
```bash
npm install
```

Automatically resolve the issues that do not require attention.
```bash
npm audit fix
```

Result after performing the previous steps. Notice the critical vulnerability count reduced from 16 to 2.

![Snyc scan fix](/journal/assets/week1/snyc-scan-fix.png)
