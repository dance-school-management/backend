#!/bin/bash
(cd product-microservice && npx prisma format)
(cd auth-microservice && npx prisma format)
(cd enroll-microservice && npx prisma format)
(cd profile-microservice && npx prisma format)
(cd notification-microservice && npx prisma format)