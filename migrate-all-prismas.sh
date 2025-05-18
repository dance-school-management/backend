#!/bin/bash
(cd product-microservice && bash migrate.sh)
(cd auth-microservice && bash migrate.sh)
(cd enroll-microservice && bash migrate.sh)
(cd profile-microservice && bash migrate.sh)
(cd review-microservice && bash migrate.sh)