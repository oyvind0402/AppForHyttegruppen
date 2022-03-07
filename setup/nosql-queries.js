use hyttegruppen;

db.createCollection(
    "cabins", 
    {validator:
        {$jsonSchema: {
            "title": "cabin",
            "bsonType": "object",
            "required": [
                "name",
                "active",
                "shortDescription",
                "longDescription",
                "address",
                "directions",
                "price",
                "cleaningPrice",
                "bedrooms",
                "bathrooms",
                "sleepingSlots",
                "features",
                "comments"
            ],
            "properties": {
                "_id": { "bsonType": "objectId" },
                "name": { "bsonType": "string" },
                "active": { "bsonType": "bool" },
                "shortDescription": { "bsonType": "string" },
                "longDescription": { "bsonType": "string" },
                "address": { "bsonType": "string" },
                "directions": { "bsonType": "string" },
                "bedrooms": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "bathrooms": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "sleepingSlots": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "price": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "cleaningPrice": {
                    "bsonType": "number",
                    "minimum": 0
                },
                "features": {
                    "bsonType": "object",
                    "additionalProperties": true
                },
                "comments": { "bsonType": "string" }
            },
            "additionalProperties": true
            }
        }
    }
);
