#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as dynamoDB from 'aws-cdk-lib/aws-dynamodb'

export const app = new cdk.App();

export const userServiceStack = new cdk.Stack(app, 'UserServiceStack', {
    env: { region: 'us-east-1' }
})
const usersTable = dynamoDB.Table.fromTableAttributes(userServiceStack, 'Users Table', { tableName: 'users' })

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
    runtime: lambda.Runtime.NODEJS_18_X,
    environment: {
        USER_AWS_REGION: process.env.USER_AWS_REGION!,
        DYNAMODB_TABLE_NAME: 'users',
    }
}

const getUsersList = new NodejsFunction(userServiceStack, 'GetUserListLambda', {
    ...sharedLambdaProps,
    functionName: 'getUsersList',
    entry: 'src/handlers/getUsersList.ts'
});

usersTable.grantReadWriteData(getUsersList)

const api = new apiGateway.HttpApi(userServiceStack, 'UserApi', {
    corsPreflight: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: [apiGateway.CorsHttpMethod.ANY]
    }
})

api.addRoutes({
    integration: new HttpLambdaIntegration('GetUsersListIntegration', getUsersList),
    path: '/users',
    methods: [apiGateway.HttpMethod.GET]
})

const getUserById = new NodejsFunction(userServiceStack, 'GetUserByIdLambda', {
    ...sharedLambdaProps,
    functionName: 'getUserById',
    entry: 'src/handlers/getUserById.ts'
})

usersTable.grantReadWriteData(getUserById)

api.addRoutes({
    integration: new HttpLambdaIntegration('GetUserByIdIntegration', getUserById),
    path: '/users/{userId}',
    methods: [apiGateway.HttpMethod.GET]
})

const createUser = new NodejsFunction(userServiceStack, 'CreateUserLambda', {
    ...sharedLambdaProps,
    functionName: 'createUser',
    entry: 'src/handlers/createUser.ts'
})

usersTable.grantReadWriteData(createUser)

api.addRoutes({
    integration: new HttpLambdaIntegration('CreateUserIntegration', createUser),
    path: '/users',
    methods: [apiGateway.HttpMethod.POST]
})

