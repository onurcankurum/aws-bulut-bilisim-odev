const AWS = require("aws-sdk");

AWS.config.update({
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "AKIAZJTSMQTUL3BM24MQ",
    "secretAccessKey": "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"
});