#!/usr/bin/env bash
cd ..
docker compose -f 'docker-compose-dev.yml' up --build --no-attach rabbitmq --no-attach elasticsearch --no-attach kibana
