#!/usr/bin/env bash
docker compose -f 'docker-compose-dev.yml' up --build --no-attach rabbitmq --no-attach elasticsearch --no-attach kibana
