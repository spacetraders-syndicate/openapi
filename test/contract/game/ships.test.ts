import { Configuration, ShipsApi } from '../../../src/sdk';
import { newUserAndConfiguration, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('ships', () => {
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
        'fetches purchaseable ships',
        async () => {
            const {
                data: { ships },
            } = await new ShipsApi(config).listGamePurchasableShips();
            expect(ships.length).toBeGreaterThan(0);
            expect(ships[0].purchaseLocations.length).toBeGreaterThan(0);
        },
        TEST_TIMEOUT,
    );
});
