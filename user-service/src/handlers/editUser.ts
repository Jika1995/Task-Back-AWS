import * as AWS from 'aws-sdk';
import { buildResponse } from '../utils';

const db = new AWS.DynamoDB.DocumentClient()

export const handler = async (event: any = {}) => {

    if (!event.body) {
        return buildResponse(400, 'You are missing the parameter body')
    }

    const userId = event.pathParameters.userId;

    if (!userId) {
        return buildResponse(400, 'Error: you are missing the path parameter id')
    }

    const editedUser = typeof event.body == 'object' ? event.body : JSON.parse(event.body);

    if (!editedUser) {
        buildResponse(400, 'no arguments provided')
    }

    const params = {
        TableName: 'users',
        Item: editedUser

    }

    try {
        await db.put(params).promise();
        return buildResponse(200, editedUser)

    } catch (err: unknown) {
        return buildResponse(500, {
            err
        })
    }
}