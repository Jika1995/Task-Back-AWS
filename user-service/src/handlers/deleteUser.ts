import * as AWS from 'aws-sdk';
import { buildResponse } from '../utils';

const db = new AWS.DynamoDB.DocumentClient()

export const handler = async (event: any = {}) => {
    const userId = event.pathParameters.userId;

    if (!userId) {
        return buildResponse(400, 'Error: you are missing the path parameter id')
    }

    const params = {
        TableName: 'users',
        Key: {
            id: userId
        }
    }

    try {
        await db.delete(params).promise();
        return buildResponse(200, 'Successfully deleted')

    } catch (err: unknown) {
        return buildResponse(500, {
            err
        })
    }
}