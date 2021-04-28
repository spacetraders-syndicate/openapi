import { DefaultApi as API } from '../../../src/sdk';
import { newUserAndApiClient, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('ships', () => {
    let api: API;
    let user: User;

    beforeAll(async () => {
        const response = await newUserAndApiClient();
        api = response.api;
        user = response.user;
    });

    beforeEach(async () => {
        await sleep();
    });

    it(
        'fetches purchaseable ships',
        async () => {
            const {
                data: { ships },
            } = await api.listGamePurchasableShips();
            expect(ships.length).toBeGreaterThan(0);
            expect(ships[0].purchaseLocations.length).toBeGreaterThan(0);
        },
        TEST_TIMEOUT,
    );
});
