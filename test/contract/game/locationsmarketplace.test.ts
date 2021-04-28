import { DefaultApi as API, Ship, System } from '../../../src/sdk';
import { buyCheapestShip, User, newUserAndApiClientAcceptedLoan, sleep } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('system locations', () => {
    let api: API;
    let user: User;
    let systems: System[];
    let ship: Ship;

    beforeAll(async () => {
        const response = await newUserAndApiClientAcceptedLoan();
        api = response.api;
        user = response.user;

        const {
            data: { systems: returnedSystems },
        } = await api.listGameSystems();
        systems = returnedSystems;
        ship = await buyCheapestShip(user.user, api, systems[0].symbol);
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'gets marketplace',
        async () => {
            const {
                data: { location },
            } = await api.getGameLocationMarketplace({
                symbol: ship.location,
            });
            expect(location.marketplace.length).toBeGreaterThan(0);
            expect(location.marketplace[0].pricePerUnit).toBeGreaterThan(0);
        },
        TEST_TIMEOUT,
    );
});
