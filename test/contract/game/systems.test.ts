import { Configuration, SystemsApi } from '../../../src/sdk';
import { newUserAndConfiguration, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('systems', () => {
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
        'fetches systems',
        async () => {
            const {
                data: { systems },
            } = await new SystemsApi(config).listGameSystems();
            expect(systems.length).toBeGreaterThan(0);
            expect(systems[0].locations.length).toBeGreaterThan(0);
            expect(systems[0].name).toBeDefined();
            expect(systems[0].symbol).toBeDefined();
        },
        TEST_TIMEOUT,
    );
});
