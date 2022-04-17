require('./db/db_connection');
const AWS = require("aws-sdk");


const DynamoDB = new AWS.DynamoDB();

function createTable() {
    const params = {
        TableName: "user",
        KeySchema: [{ AttributeName: "title", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "title", AttributeType: "S" }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10,
        },
    };

    DynamoDB.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to create table", err);
        } else {
            console.log("Created table", data);
        }
    });
}

function register(body) {
    const paramsTable = {
        TableName: "user",
    };


    DynamoDB.scan(paramsTable, function(err, data) {
        if (err) {
            console.error("Unable to find data", err);
        } else {
            console.log(`Found ${data.Count} user`);
            const params = {
                TableName: "user",
                Item: {
                    id: { S: (data.Count + 1).toString() },
                    user_name: { S: body.user_name },
                    user_lastname: { S: body.user_lastname },
                    user_email: { S: body.user_email },
                    user_password: { S: body.user_password },
                    user_book_list: { L: body.user_book_list }
                },
            };
            DynamoDB.putItem(params, function(err) {
                if (err) {
                    console.error("failed to : ", err);
                } else {
                    console.log(`Added user`);
                }
            });
        }
    });
}

function updateUser(body) {
    const params = {
        TableName: "user",
        Item: {
            id: { N: body.id },
            user_name: { S: body.user_name },
            user_lastname: { S: body.user_lastname },
            user_email: { S: body.user_email },
            user_password: { S: body.user_password },
            user_book_list: { L: body.user_book_list }
        },
        ReturnConsumedCapacity: "TOTAL",
    };

    var result = DynamoDB.putItem(params, function(err) {
        if (err) {
            console.error("Update failed", err);
        } else {
            console.log("update is successful");
        }
    });

    return result;
}




function inserBook(body) {
    const paramsTable = {
        TableName: "books",
    };


    DynamoDB.scan(paramsTable, function(err, data) {
        if (err) {
            console.error("Unable to find data", err);
        } else {
            console.log(`Found ${data.Count} book`);
            //console.log(data.Items);
            const params = {
                TableName: "books",
                Item: {
                    id: { N: (data.Count + 1).toString() },
                    is_deleted: {S: "false"},
                    book_name: { S: body.book_name },
                    ideas: { S: body.ideas },
                    author: { S: body.author },
                    imgUrl: { S: body.imgUrl },
                    publisher_editor: { S: body.publisher_editor }
                },
            };
            DynamoDB.putItem(params, function(err) {
                if (err) {
                    console.error("failed to : ", err);
                } else {
                    console.log(`Added your book`);
                }
            });
        }
    });
}





const getAllBook = async() => {
    const params = {
        TableName: "books",
      //  is_deleted:{S: "false"},
   /*   Item: {
        is_deleted: 'false'
      }
      */
    };
  
    let scanResults = [];
    let items;
    do {
        items = await DynamoDB.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");

    return scanResults;

};




function updateBook(body) {
    const params = {
        TableName: "books",
        Item: {
            id: { N: body.id },
            book_name: { S: body.book_name },
            ideas: { S: body.ideas },
            author: { S: body.author },
            imgUrl: { S: body.imgUrl },
            publisher_editor: { S: body.publisher_editor }
        },
        ReturnConsumedCapacity: "TOTAL",
    };

    DynamoDB.putItem(params, function(err) {
        if (err) {
            console.error("Update failed", err);
        } else {
            console.log("update is successful");
        }
    });

}

function deleteMovie(title) {
    var result = {};
    const params = {
        TableName: "Movies",
        Key: {
            title: { S: title },
        },
    };

}


async function deleteBook(id) {
    const params = {
        TableName: "books",
        Key: {
            id: { N: id },
        },
    };
    return await DynamoDB.deleteItem(params).promise();

}


const login = async() => {
    const params = {
        TableName: "user",
    };

    let scanResults = [];
    let items;
    do {
        items = await DynamoDB.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");

    return scanResults;

};


module.exports = {

    inserBook,
    getAllBook,
    deleteBook,
    updateBook,
    register,
    updateUser,
    login

};