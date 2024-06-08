#! /usr/bin/bash

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