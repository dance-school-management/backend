cd ..
microservices=(
  "api-gateway"
  "product-microservice"
  "auth-microservice"
  "enroll-microservice"
  "notification-microservice"
  "profile-microservice"
  "blog-microservice"
)
for service in "${microservices[@]}"; do
  cd "$service"
  rm -f random.txt
  git add random.txt
  cd ..
done