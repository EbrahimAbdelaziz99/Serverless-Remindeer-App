import { APIGatewayProxyEvent } from "aws-lambda";
import { formatJSONResponse } from "@libs/apiGateway";
import { dynamo } from "@libs/dynamo";

export const handler = async(event :APIGatewayProxyEvent) => {
    try {
        
        const tableName:string = process.env.reminderTable;

        const { userId } = event.pathParameters || {};

        console.log(userId);

        if(!userId) {
            return formatJSONResponse({
                statusCode:400,
                data: { message:'missing userId in path' }
            })
        }

        const data = await dynamo.query({
            tableName,
            index:'index1',
            pkValue:userId
        })

        console.log(data);

    return formatJSONResponse({
        data,
    })
    
    } catch (error) {
        console.log("error" ,error);
        return formatJSONResponse({
            statusCode:502,
            data:{
                message:error.message,
            }
        });
    }
}

