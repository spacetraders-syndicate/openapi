import { DefaultApi as API, Ship, System } from '../../../src/sdk';
import { buyCheapestShip, newUserAndApiClientAcceptedLoan, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('user structures', () => {
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
        'list structures',
        async () => {
            const {
                data: { structures },
            } = await api.listUserStructures({
                username: user.user.username,
            });

            expect(structures.length).toBeGreaterThanOrEqual(0);
        },
        TEST_TIMEOUT,
    );
});
