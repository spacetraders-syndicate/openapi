import { Configuration, UsersApi } from '../../../src/sdk';
import { newUserAndConfiguration, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('user info', () => {
    let config: Configuration;
    let user: User;

    beforeAll(async () => {
        const response = await newUserAndConfiguration();
        config = response.config;
        user = response.user;
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'fetches info',
        async () => {
            const userInfo = await new UsersApi(config).getAccount();
            expect(userInfo.data.user.credits).toBe(0);
            expect(userInfo.data.user.shipCount).toBe(0);
            expect(userInfo.data.user.structureCount).toBe(0);
            expect(userInfo.data.user.username).toBe(user.user.username);
        },
        TEST_TIMEOUT,
    );
});
