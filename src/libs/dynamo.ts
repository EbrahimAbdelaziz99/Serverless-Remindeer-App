import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand ,PutCommandInput } from '@aws-sdk/lib-dynamodb';

const dyanamoClient = new DynamoDBClient({})

export const dynamo = {
    write: async(data:Record<string, any>,tableName:string) => {
        
        const params:PutCommandInput = {
            TableName: tableName,
            Item:data
        };

        const command = new PutCommand(params);

        await dyanamoClient.send(command);

        return data;
    },
}