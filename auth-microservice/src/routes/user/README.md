Requirements:

- endpoint for creating user data:
  1. create account in auth microservice
  2. asks profile microservice to persist additional data
  3. if something fails we rollback
