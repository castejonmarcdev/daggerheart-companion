#!/bin/bash
set -e

echo "Starting MongoDB..."
mongod --bind_ip_all --fork --logpath /var/log/mongodb.log

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to start..."
for i in {1..30}; do
    if mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo "MongoDB is ready!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 1
done

# Check if database needs seeding
echo "Checking if database needs seeding..."
COLLECTION_COUNT=$(mongosh --quiet --eval "db.getSiblingDB('daggerheart').getCollectionNames().length")

if [ "$COLLECTION_COUNT" -eq "0" ]; then
    echo "Database is empty, running seed script..."
    cd /app && node dist/scripts/seed.js
    echo "Seeding complete!"
else
    echo "Database already has data, skipping seed."
fi

echo "Starting Daggerheart API..."
exec node /app/dist/index.js
