import { Configuration, PurchaseOrdersApi, UserShip, ShipsApi, System, SystemsApi } from '../../../src/sdk';
import { buyCheapestShip, User, newUserAndConfigAcceptedLoan, sleep } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('ship operations', () => {
    let config: Configuration;
    let user: User;
    let systems: System[];
    let shipA: UserShip;
    let shipB: UserShip;

    beforeAll(async () => {
        const response = await newUserAndConfigAcceptedLoan();
        config = response.config;
        user = response.user;

        const {
            data: { systems: returnedSystems },
        } = await new SystemsApi(config).listGameSystems();
        systems = returnedSystems;

        shipA = await buyCheapestShip(user.user, config, systems[0].symbol);
        shipB = await buyCheapestShip(user.user, config, systems[0].symbol);
        const purchasedFuel = await new PurchaseOrdersApi(config).createUserPurchaseOrder({
            username: user.user.username,
            createUserPurchaseOrderPayload: {
                shipId: shipA.id,
                good: 'FUEL',
                quantity: 50,
            },
        });
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'jettisons cargo and ship cargo lookup',
        async () => {
            const jettison = await new ShipsApi(config).jettisonShipCargo({
                username: user.user.username,
                shipId: shipA.id,
                jettisonShipCargoPayload: {
                    good: 'FUEL',
                    quantity: 13,
                },
            });

            const {
                data: { ship },
            } = await new ShipsApi(config).getUserShip({
                username: user.user.username,
                shipId: shipA.id,
            });

            expect(ship.cargo).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        good: 'FUEL',
                    }),
                ]),
            );

            expect(jettison.data.good).toBe('FUEL');
            expect(jettison.data.quantityRemaining).toBe(37);
        },
        TEST_TIMEOUT,
    );

    it(
        'transfers cargo',
        async () => {
            const transfer = await new ShipsApi(config).transferShipCargo({
                username: user.user.username,
                fromShipId: shipA.id,
                transferShipCargoPayload: {
                    toShipId: shipB.id,
                    good: 'FUEL',
                    quantity: 13,
                },
            });

            expect(transfer.data.fromShip.id).toBe(shipA.id);
            expect(transfer.data.toShip.id).toBe(shipB.id);
        },
        TEST_TIMEOUT,
    );
});
