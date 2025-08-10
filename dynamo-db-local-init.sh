aws dynamodb create-table \
    --endpoint-url http://localhost:8000/ \
    --region local \
    --table-name LambdaCRMTable \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=SK,AttributeType=S \
        AttributeName=email,AttributeType=S \
    --key-schema \
        AttributeName=PK,KeyType=HASH \
        AttributeName=SK,KeyType=RANGE \
    --global-secondary-indexes '[
        {
            "IndexName": "EmailIndex",
            "KeySchema": [
                { "AttributeName": "email", "KeyType": "HASH" }
            ],
            "Projection": { "ProjectionType": "ALL" },
            "ProvisionedThroughput": {
                "ReadCapacityUnits": 1,
                "WriteCapacityUnits": 1
            }
        }
    ]' \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
