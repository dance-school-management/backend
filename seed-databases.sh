#!/bin/bash
(bash clear-databases.sh)
sleep 6
(cd auth-microservice && bash seed.sh)
# (cd profile-microservice && bash seed.sh)
# (cd product-microservice && bash clear.sh)
# (cd enroll-microservice && bash clear.sh)
# (cd profile-microservice && bash clear.sh)
# (cd notification-microservice && bash clear.sh)