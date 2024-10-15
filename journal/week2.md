# Week 2 — Distributed Tracing

In week 2 we implemented tracing with Honeycomb and AWS X-Ray, and logging with Rollbar and AWS CloudWatch.

Tracing can help understand how a request flows through the different services that a system is composed of by annotating the request with useful information as it travels along the services. It becomes more valuable in a microservice architecture where a request could be processed by multiple services.

Logging helps more with troubleshooting a specific service by capturing the context when an issue happens and sending an alert.

## Honeycomb

[Honeycomb](https://www.honeycomb.io/) is a service where trace information can be sent to and it supports OpenTelemetry. OpenTelemetry is a vendor- and tool-agnostic observability framework. It offers a collection of APIs, SDKs, and tools which can be used to collect telemetry data like traces and send to a compatible service like Honeycomb.

Once the service to be monitored is set up, the dashboard page on Honeycomb shows a high-level overview of the performance.

![honeycomb dashboard](/journal/assets/week2/honeycomb-dashboard.png)

You can also drill down into a specific trace. Notice the custom `home-activities-mock-data` span in the middle of the screen and the custom fields `app.now` and `app.result_length` to the right.

![honeycomb custom span and fields](/journal/assets/week2/honeycomb-custom-span-and-fields.png)

There is also a query page to surface specific information.

![honeycomb-query](/journal/assets/week2/honeycomb-query.png)

An additional challenge after instrumenting the backend was to also implement tracing in the frontend. That process is fairly well documented in the [Honeycomb documentation](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/#add-automatic-instrumentation).

When I tried to follow the instructions, I ran into an issue where the browser would log `web-vitals-autoinstrumentation.js:134 Uncaught TypeError: (0 , attribution_1.onCLS) is not a function` into the console. I found the same issue on GitHub and someone thankfully [posted a workaround](https://github.com/honeycombio/honeycomb-opentelemetry-web/issues/139#issuecomment-2093754496) which solved the issue for me.

The dashboard for the frontend then looked like this.

![honeycomb frontend](/journal/assets/week2/honeycomb-frontend.png)

Another challenge I faced with the frontend is that I didn't know how to pass in the Honeycomb API key without exposing it as a hardcoded string. I committed and pushed the API key to GitHub and within minutes received an email from GitGuardian about an exposed secret. After researching it a bit I found that it's possible to pass in environment variables at runtime using `process.env` and use environment variables that start with `REACT_APP_`.

After that was figured out, the secret needed to be removed from the repository. Thanks to the [exercise in week 0](https://github.com/danielwohlgemuth/aws-bootcamp-cruddur/blob/main/journal/week0.md#bfg-repo-cleaner) I already knew how to do that with BFG Repo-Cleaner.

![honeycomb frontend env var](/journal/assets/week2/honeycomb-frontend-env-var.png)

Another step was to disable the exposed API key in  Honeycomb. When I went into Honeycomb to disable it I was surprised to learn that the API key (which is provided by default) had more permissions than only sending data and that you can't delete it, only disable all options. Through this exercise I found that there is a way to create Ingest API keys, which are for data ingest only. This would be the more appropriate option to use for the frontend compared to the API key I had exposed, which was a Configuration API key.

![honeycomb api key configuration](/journal/assets/week2/honeycomb-api-key-configuration.png)

## AWS X-Ray

[AWS X-Ray](https://aws.amazon.com/xray/) is another tracing service that we tried out. It's possible to send trace information to it using the AWS Distro for OpenTelemetry (ADOT) SDK or the X-Ray SDK, although the X-Ray SDK is indicated as a legacy product in the documentation.

The documentation provides a good [guide](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-python.html) on how to set up the X-Ray SDK in Python. Once that's done, there are two ways to add additional information to a trace: annotation and metadata. Annotations are indexed and can be used in a query to filter by it. Metadata are not indexed and can't be used in a search.

This is what the X-Ray dashboard looks like.

![xray trace dashboard](/journal/assets/week2/xray-trace-dashboard.png)

Here is a custom `mock-data` subsegment and custom `results-size` and `now` fields to the right.

![xray subsegment with metadata](/journal/assets/week2/xray-subsegment-with-metadata.png)

One of the features of X-Ray is the Trace Map which displays all the services involved in requests. Since this project has only a single backend, only one service is shown.

![xray trace map](/journal/assets/week2/xray-trace-map.png)

## Rollbar

[Rollbar](https://rollbar.com/) is an error monitoring and alerting service.


With Rollbar, it's possible to log information explicitly (with `rollbar.report_message('Hello World!', 'warning')` in Python, for example) but it can also capture and report on unhandled exceptions.

This is the dashboard page, giving an overview of the different log types that have been happening.

![rollbar dashboard](/journal/assets/week2/rollbar-dashboard.png)

The search page to filter for specific logs.

![rollbar items](/journal/assets/week2/rollbar-items.png)

Here is the view of an individual log. In this case an unhandled exception with a stack trace and context information at the time the exception happened.

![rollbar item](/journal/assets/week2/rollbar-item.png)

One challenge I had while following the course instructions to set up Rollbar was that the `@app.before_first_request` annotation, which was used to initialize Rollbar, had been removed since Flask 2.3, with the current Flask version being 3.0.3.

The workaround I found was to replace this

```python
@app.before_first_request
def init_rollbar():
```

with this

```python
with app.app_context():
```

## AWS CloudWatch

[AWS CloudWatch](https://aws.amazon.com/cloudwatch/) is a monitoring service. It includes AWS X-Ray but it can also be used to monitor logs and has similar features like Rollbar except for out-of-the-box email alerts.

Here is an example of a custom log and an unhandled exception that the backend sent to CloudWatch.

![cloudwatch logs](/journal/assets/week2/cloudwatch-logs.png)

## Cloud Journey

One of [the segments](https://www.youtube.com/watch?v=zA8guDqfv40&t=57255s) in week 2 was about how to prepare for a role in the cloud and how to give that effort a direction. The statement that follows would be my current plan. I will not update it here but it will definitely change over time as the technologies listed under "not get distracted by", for example, are interesting to me but don't fit into the current plan and will have to be revisited later.

### My journey to the cloud
- **I am going to become a:** Cloud Developer/Engineer
- **I am a good fit because:** I have a background in software engineering and have theoretical knowledge about cloud service through certifications
- **I will know:** AWS, Python, React, Postgres, CI/CD
- **I will not get distracted by:** Azure/GCP, Terraform, Machine Learning/AI, Kubernetes
