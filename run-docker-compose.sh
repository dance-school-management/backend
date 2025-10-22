#!/usr/bin/env bash
docker compose -f 'docker-compose-dev.yml' up --build --no-attach elasticsearch --no-attach kibana