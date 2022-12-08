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
        package:{
            patterns:[
                "node_modules/axios/**"
            ]
        }  
    },
    getRminder : {
        handler: 'src/functions/getReminder/index.handler',
        events: [
            {
                httpApi: {
                    path:"/get",
                    method:"get"
                }
            }
        ]
    }
}

export default functions