import { Configuration, PurchaseOrdersApi, SellOrdersApi, UserShip, System, SystemsApi } from '../../../src/sdk';
import { buyCheapestShip, User, newUserAndConfigAcceptedLoan, sleep } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('user marketplace', () => {
    let config: Configuration;
    let user: User;
    let systems: System[];
    let ship: UserShip;

    beforeAll(async () => {
        const response = await newUserAndConfigAcceptedLoan();
        config = response.config;
        user = response.user;

        const {
            data: { systems: returnedSystems },
        } = await new SystemsApi(config).listGameSystems();
        systems = returnedSystems;
        ship = await buyCheapestShip(user.user, config, systems[0].symbol);
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'sell at marketplace',
        async () => {
            const purchasedFuel = await new PurchaseOrdersApi(config).createUserPurchaseOrder({
                createUserPurchaseOrderPayload: {
                    shipId: ship.id,
                    good: 'FUEL',
                    quantity: 50,
                },
            });

            const sellFuelOrder = await new SellOrdersApi(config).createUserSellOrder({
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
