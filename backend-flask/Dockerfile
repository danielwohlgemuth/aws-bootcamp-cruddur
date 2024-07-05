FROM AWS_ACCOUNT_ID_HERE.dkr.ecr.us-east-1.amazonaws.com/cruddur-python:3.12.3-slim-bookworm

WORKDIR /backend-flask

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_ENV=development
ENV FLASK_DEBUG=1

EXPOSE ${PORT}
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=4567"]