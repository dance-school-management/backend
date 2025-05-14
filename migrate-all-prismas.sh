#!/bin/bash
(cd product-microservice && bash migrate.sh)
(cd auth-microservice && bash migrate.sh)
(cd enroll-microservice && bash migrate.sh)
(cd notification-microservice && bash migrate.sh)