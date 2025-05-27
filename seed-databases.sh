#!/bin/bash
(bash clear-databases.sh)
sleep 8
(cd auth-microservice && bash seed.sh)
# (cd profile-microservice && bash seed.sh)
(cd product-microservice && bash seed.sh)
(cd enroll-microservice && bash seed.sh)
# (cd notification-microservice && bash clear.sh)