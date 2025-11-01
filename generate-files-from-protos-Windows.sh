#!/usr/bin/env bash
(cd product-microservice && bash proto/buildWindows.sh)
(cd auth-microservice && bash proto/buildWindows.sh)
(cd enroll-microservice && bash proto/buildWindows.sh)
(cd profile-microservice && bash proto/buildWindows.sh)
# (cd elasticsearch-microservice && source .venv/Scripts/activate && bash src/proto/build.sh)