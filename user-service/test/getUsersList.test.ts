import { handler } from '../src/handlers/getUsersList';
import { USERS } from '../src/constants';
import { buildResponse } from "../src/utils";

describe('render user list', () => {
    test('need to return users list array', async () => {
        const response = await handler();
        expect(response).toEqual(buildResponse(200, USERS))
    })

    test('error', async () => {
        try {
            const response = await handler()
        } catch {
            const mockError = new Error('Test Error');
            const res = buildResponse(500, {
                mockError
            })

            expect(res).toEqual(buildResponse(500, {
                mockError
            }))
        }

    })
})