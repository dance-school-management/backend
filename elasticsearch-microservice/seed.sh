export PYTHONPATH=.
echo "Executing seed command in es-microservice... "
(python src/seed/seed.py || python3 src/seed/seed.py)