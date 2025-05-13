#!/bin/bash
(cd product-microservice && npm run prettier)
(cd auth-microservice && npm run prettier)
(cd enroll-microservice && npm run prettier)
(cd profile-microservice && npm run prettier)