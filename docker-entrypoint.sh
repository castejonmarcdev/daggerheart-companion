#!/bin/bash

echo "[$(date -Iseconds)] Starting MongoDB in background..."
mongod --bind_ip_all --fork --logpath /var/log/mongodb.log --nojournal --smallfiles 2>/dev/null || mongod --bind_ip_all --fork --logpath /var/log/mongodb.log

echo "[$(date -Iseconds)] Starting Daggerheart API immediately..."
# Start Node.js server - it will retry MongoDB connection in background
cd /app

# Run seeding in background after a delay
(
    sleep 10
    echo "[$(date -Iseconds)] Checking if database needs seeding..."
    for i in {1..30}; do
        if mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
            COLLECTION_COUNT=$(mongosh --quiet --eval "db.getSiblingDB('daggerheart').getCollectionNames().length" 2>/dev/null || echo "0")
            if [ "$COLLECTION_COUNT" = "0" ] || [ -z "$COLLECTION_COUNT" ]; then
                echo "[$(date -Iseconds)] Database is empty, running seed script..."
                node dist/scripts/seed.js
                echo "[$(date -Iseconds)] Seeding complete!"
            else
                echo "[$(date -Iseconds)] Database already has $COLLECTION_COUNT collections, skipping seed."
            fi
            break
        fi
        echo "[$(date -Iseconds)] Waiting for MongoDB... ($i/30)"
        sleep 2
    done
) &

exec node dist/index.js
