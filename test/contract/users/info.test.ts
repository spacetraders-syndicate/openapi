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
            const userInfo = await new UsersApi(config).getUser({
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
