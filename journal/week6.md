# Week 6 — Deploying Containers

Week 6 was dedicated to get the frontend and backend to run entirely on AWS. Those two components of the system were only running on Gitpod so far. The goal was to package the frontend and backend into containers and have them running on AWS with Elastic Container Service.

## AWS Setup

### Route 53

A domain name was needed to serve the app. I decided to go with `cruddur-dw.com`. The root domain will be used to serve the frontend and the `api.cruddur-dw.com` domain will be used to serve the backend.

![aws route 53](/journal/assets/week6/aws-route-53.png)

### Certificate Manager

In order to serve the app over HTTPS, a certificate was registered, covering the root domain as well as the first level subdomains with `*.cruddur-dw.com`.

![aws certificate](/journal/assets/week6/aws-certificate.png)

### Application Load Balancer (ALB)

The ALB handles the routing of the traffic. It redirects HTTP (port 80) to HTTPS (port 443) and forwards HTTPS traffic to the frontend or backend.

![aws application load balancer](/journal/assets/week6/aws-application-load-balancer.png)

If the host header (domain name) of the request starts with `api.`, the traffic gets forwarded to the backend. Otherwise, it goes to the frontend.

![aws-application-load-balancer-443-listener](/journal/assets/week6/aws-application-load-balancer-443-listener.png)

### Target Group

The target groups are used inside of the ALB. They define the port to which to send the traffic for each service and also perform health checks on each service.

![aws-target-groups](/journal/assets/week6/aws-target-groups.png)

### Elastic Container Registry

The Elastic Container Registry was used to store the Docker images to avoid having to download them from a source outside of AWS and incur cost that way. Apart from the Docker images for the backend and frontend, the `cruddur-python` image was also created to serve as a base for the backend image.

![aws-ecr](/journal/assets/week6/aws-ecr.png)

### Elastic Container Service

The last step was to launch the frontend and backend services on Elastic Container Service.

![aws-ecs-services](/journal/assets/week6/aws-ecs-services.png)

Each service is related to a task which defines which containers to run and also performs health checks to replace unhealthy services automatically.

![aws-ecs-tasks](/journal/assets/week6/aws-ecs-tasks.png)

### Result

After all those steps, the Cruddur app is finally accessible while running completely on AWS.

![cruddur served from new domain](/journal/assets/week6/cruddur-new-domain.png)

Note that `cruddur-dw.com` is only available during active development since running it constantly produces ongoing costs.

## Spend

This week had several additional costs compared to weeks before.

- **Domain:** The biggest spend was due to the cost of the `cruddur-dw.com` domain at $14.
- **Hosted zone:** The domain is in a hosted zone, which will cost $0.5 per month from now on.
- **Public IPv4 address:** Public IPv4 addresses are consumed by the application load balancer and the elastic container services. This cost shows up under Amazon Virtual Private Cloud.
- **AWS Fargate:** Elastic Container Service is configured to use AWS Fargate to simplify the container management. AWS Fargate has an additional cost depending on the CPU and Memory configuration.

![aws cost](/journal/assets/week6/aws-cost.png)
