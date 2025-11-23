#!/usr/bin/env bash
(bash clear-databases.sh)
# Wait for databases to be fully cleared before seeding
sleep 8
cd ..
(cd auth-microservice && bash seed.sh)
(cd profile-microservice && bash seed.sh)
(cd product-microservice && bash seed.sh)
(cd enroll-microservice && bash seed.sh)
(cd blog-microservice && bash seed.sh)
# (cd elasticsearch-microservice && (. .venv/bin/activate || source .venv/Scripts/activate) &&  bash seed.sh)
# (cd notification-microservice && bash clear.sh)