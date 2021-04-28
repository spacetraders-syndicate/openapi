import { DefaultApi as API, Ship, System } from '../../../src/sdk';
import { buyCheapestShip, newUserAndApiClientAcceptedLoan, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('user flight plans', () => {
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

    it(
        'creates flight plan',
        async () => {
            expect(flightPlans.length).toBeGreaterThanOrEqual(0);
        },
        TEST_TIMEOUT,
    );
});
