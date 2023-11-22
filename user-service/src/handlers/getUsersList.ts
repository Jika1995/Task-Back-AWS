import { buildResponse } from '../utils';
import * as AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient()

export const handler = async () => {
    const params = {
        TableName: 'users'
    }

    try {

        const response = await db.scan(params).promise();
        const users = response.Items

        if (!users) {
            return buildResponse(404,
                'Error: There is no users'
            )
        }

        return buildResponse(200,
            users
        );
    } catch (err: unknown) {
        return buildResponse(500, {
            err
        })
    }
}