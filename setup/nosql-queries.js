use hyttegruppen;

//FIXME Remove drops

db.faq.drop()

db.cabins.drop()

db.createCollection(
    "cabins", 
    {validator:
        {$jsonSchema: {
            "title": "cabin",
            "bsonType": "object",
            "required": [
                "_id",
                "active",
                "shortDescription",
                "longDescription",
                "address",
                "directions",
                "price",
                "cleaningPrice",
                "features",
                "comments"
            ],
            "properties": {
                "_id": { "bsonType": "string" },
                "active": { "bsonType": "bool" },
                "shortDescription": { "bsonType": "string" },
                "longDescription": { "bsonType": "string" },
                "address": { "bsonType": "string" },
                "directions": { "bsonType": "string" },
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
                    "required": [
                        "countableFeatures",
                        "uncountableFeatures",
                    ],
                    "properties": {
                        "countableFeatures": {
                            "bsonType": "object",
                            "required": [
                                "bathrooms",
                                "bedrooms",
                                "sleepingSlots"
                            ],
                            "properties": {
                                "bathrooms": {
                                    "bsonType": "number",
                                    "minimum": 0
                                },
                                "sleepingSlots": {
                                    "bsonType": "number",
                                    "minimum": 0
                                },
                                "bedrooms": {
                                    "bsonType": "number",
                                    "minimum": 0
                                },
                            },
                            "additionalProperties": true
                        },
                        "uncountableFeatures" : {
                            "bsonType": "object",
                            "required": [
                                "wifi",
                            ],
                            "properties": {
                                "wifi": {
                                    "bsonType": "bool",
                                },
                            },
                            "additionalProperties": true
                        }
                    },
                    "additionalProperties": false
                },
                "comments": { "bsonType": "string" }
            },
            "additionalProperties": true
            }
        }
    }
);
