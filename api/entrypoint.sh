#!/bin/sh

echo "Waiting for the database to be available..."
./wait-for-it.sh postgresql:5432 --timeout=30 --strict -- echo "Database is up"

npx prisma db push

echo "Starting the application..."
exec node dist/main