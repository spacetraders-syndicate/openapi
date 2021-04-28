import { DefaultApi as API, Ship, System } from '../../../src/sdk';
import { buyCheapestShip, User, newUserAndApiClientAcceptedLoan, sleep } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('user marketplace', () => {
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
        'sell at marketplace',
        async () => {
            const purchasedFuel = await api.createUserPurchaseOrder({
                username: user.user.username,
                createUserPurchaseOrderPayload: {
                    shipId: ship.id,
                    good: 'FUEL',
                    quantity: 50,
                },
            });

            const sellFuelOrder = await api.createUserSellOrder({
                username: user.user.username,
                createUserSellOrderPayload: {
                    shipId: ship.id,
                    good: 'FUEL',
                    quantity: 33,
                },
            });

            expect(sellFuelOrder.data.credits).toBeGreaterThan(0);
            expect(sellFuelOrder.data.order.good).toBe('FUEL');
            expect(sellFuelOrder.data.order.quantity).toBe(33);
        },
        TEST_TIMEOUT,
    );
});
