import { DefaultApi as API, Ship, System } from '../../../src/sdk';
import { buyCheapestShip, newUserAndApiClientAcceptedLoan, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('game structures', () => {
    let api: API;
    let user: User;
    let ship: Ship;
    let systems: System[];

    beforeAll(async () => {
        const response = await newUserAndApiClientAcceptedLoan();
        api = response.api;
        user = response.user;
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'fetches structures',
        async () => {
            const {
                data: { structures },
            } = await api.listGameStructures();
            expect(structures[0].price).toBeGreaterThan(0);
            expect(structures.length).toBeGreaterThan(0);
        },
        TEST_TIMEOUT,
    );
});
