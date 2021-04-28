import { DefaultApi as API } from '../../../src/sdk';
import { newUserAndApiClient, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('user info', () => {
    let api: API;
    let user: User;

    beforeAll(async () => {
        const response = await newUserAndApiClient();
        api = response.api;
        user = response.user;
    });

    it(
        'fetches info',
        async () => {
            const userInfo = await api.getUser({
                username: user.user.username,
            });
            expect(userInfo.data.user.credits).toBe(0);
            expect(userInfo.data.user.loans?.length).toBe(0);
            expect(userInfo.data.user.ships?.length).toBe(0);
            expect(userInfo.data.user.username).toBe(user.user.username);
        },
        TEST_TIMEOUT,
    );
});
