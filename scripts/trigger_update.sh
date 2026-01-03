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
  randome_string=$(LC_CTYPE=C tr -dc A-Za-z0-9 < /dev/urandom | head -c 8)
  echo "Triggering update for $service with $randome_string"
  echo "$randome_string" >> random.txt
  git add random.txt
  cd ..
done