#!/usr/bin/env bash
(cd product-microservice && bash proto/build.sh)
(cd auth-microservice && bash proto/build.sh)
(cd enroll-microservice && bash proto/build.sh)
(cd profile-microservice && bash proto/build.sh)
# (cd elasticsearch-microservice && . .venv/bin/activate && bash src/proto/build.sh)
(cd ai-microservice && bash src/proto/build.sh)
