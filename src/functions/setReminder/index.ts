import { APIGatewayProxyEvent } from "aws-lambda";
import { formatJSONResponse } from "@libs/apiGateway";
import { dynamo } from "@libs/dynamo";
import { v4 as uuid } from 'uuid'

export const handler = async(event :APIGatewayProxyEvent) => {
    try {
        
    const body = JSON.parse(event.body);

    const tableName:string =  process.env.reminderTable;

    const { email,phoneNumber,reminder,reminderDate } = body

    const validationErrors = validateInput(
        { 
            email,
            phoneNumber,
            reminder,
            reminderDate
        } 
    );

    if(validationErrors) {
        return validationErrors
    }

    const userId: string|number = email || phoneNumber;

    const data = {
        email,
        phoneNumber,
        reminder,
        reminderDate,
        userId,
        
        id:uuid(),
        TTL: reminderDate/1000,
        pk :userId,
        sk:reminderDate.toString(),
    };

    await dynamo.write(data,tableName);

    return formatJSONResponse({
        data: {
            message: `reminder is set for ${new Date(reminderDate).toDateString()}`,
            id:data.id
        }
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


const validateInput = ({
    email,
    phoneNumber,
    reminder,
    reminderDate
}: { 
    email?: string
    phoneNumber?: string,
    reminder:string
    reminderDate: number
}) => {
    if(!email && !phoneNumber) {
        return formatJSONResponse({
            statusCode:400,
            data:{
                message: "email or a phone number is required to set a reminder!"
            }
        })
    }

    if(!reminder) {
        return formatJSONResponse({
            statusCode:400,
            data:{
                message: "reminder required to set a reminder!"
            }
        })
    }

    if(!reminderDate) {
        return formatJSONResponse({
            statusCode:400,
            data:{
                message: "reminderDate required to set a reminder!"
            }
        })
    }

    return; 
}