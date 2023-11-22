// import { PRODUCTS } from '../constants';
import { buildResponse } from '../utils'
import * as AWS from 'aws-sdk';

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
        const response = await db.get(params).promise();

        if (response.Item) {
            return buildResponse(200,
                response.Item
            );
        } else {
            return buildResponse(404, 'Not found')
        }

    } catch (err: unknown) {
        return buildResponse(500, {
            err
        })
    }
}