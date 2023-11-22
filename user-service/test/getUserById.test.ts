import { handler } from '../src/handlers/getUserById';
import { USERS } from '../src/constants';
import { buildResponse } from "../src/utils";

describe('return user by id', () => {
    test('need to return user by id', async () => {
        const event = {
            pathParameters: { userId: '1' }
        }

        const response = await handler(event)
        const userToFind = USERS.find(item => item.id === '1')
        expect(response).toEqual(buildResponse(200, userToFind))
    })

    test('error no parameters', async () => {
        const event = {
            pathParameters: {}
        }

        const response = await handler(event);

        expect(response).toEqual(buildResponse(400, 'Error: you are missing the path parameter id'))

    })

    test('error', async () => {
        const event = {
            pathParameters: { userId: '1' },
        };

        try {
            const response = await handler(event)
        } catch {

            const mockError = new Error('Test Error');
            const result = buildResponse(500, { mockError })

            expect(result).toEqual(buildResponse(500, {
                mockError
            }))
        }
    })
})