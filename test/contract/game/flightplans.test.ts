import { DefaultApi as API, Ship, System } from '../../../src/sdk';
import { buyCheapestShip, newUserAndApiClientAcceptedLoan, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('flight plans', () => {
    let api: API;
    let user: User;
    let ship: Ship;
    let systems: System[];

    beforeAll(async () => {
        const response = await newUserAndApiClientAcceptedLoan();
        api = response.api;
        user = response.user;
        const {
            data: { systems: systemsResponse },
        } = await api.listGameSystems();
        systems = systemsResponse;
        ship = await buyCheapestShip(user.user, api, systems[0].symbol);
    });

    beforeEach(async () => {
        await sleep();
    });

    it(
        'fetches flight plans',
        async () => {
            const {
                data: { flightPlans },
            } = await api.listGameSystemFlightPlans({
                symbol: systems[0].symbol,
            });
            expect(flightPlans.length).toBeGreaterThanOrEqual(0);
        },
        TEST_TIMEOUT,
    );
});
