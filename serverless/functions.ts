import type { AWS } from '@serverless/typescript';

const functions: AWS["functions"] = {
    setReminder : {
        handler: 'src/functions/setReminder/index.handler',
        events: [
            {
                httpApi: {
                    path:'/',
                    method:'post'
                }
            }
        ],
    },
    sendRminder : {
        handler: 'src/functions/sendReminder/index.handler',
        events: [
            {
                stream: {
                    type:'dynamodb',
                    arn:{
                        "Fn::GetAtt":["reminderTable","StreamArn"]
                    },
                    filterPatterns:[
                        // dynamodb
                        // {
                        //     eventName:["REMOVE"],
                            
                        // },
                    ],
                    // types of eventName :
                    // "eventName": "INSERT" | "MODIFY" | "REMOVE"
                }
            }
        ],
        //@ts-expect-error
        iamRoleStatements: [
            {
                Effect:'Allow',
                Action:[
                    'ses:sendEmail',
                    'sns:Publish'
                ],
                Resource:'*'
            }
        ]
    },
    getReminders : {
        handler: 'src/functions/getReminders/index.handler',
        events: [
            {
                httpApi: {
                    path:'/{userId}',
                    method:'get'
                }
            }
        ],
    },
}

export default functions