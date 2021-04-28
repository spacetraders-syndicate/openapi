import { DefaultApi as API, Ship, System } from '../../../src/sdk';
import { buyCheapestShip, User, newUserAndApiClientAcceptedLoan, sleep } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('ship operations', () => {
    let api: API;
    let user: User;
    let systems: System[];
    let shipA: Ship;
    let shipB: Ship;

    beforeAll(async () => {
        const response = await newUserAndApiClientAcceptedLoan();
        api = response.api;
        user = response.user;

        const {
            data: { systems: returnedSystems },
        } = await api.listGameSystems();
        systems = returnedSystems;

        shipA = await buyCheapestShip(user.user, api, systems[0].symbol);
        shipB = await buyCheapestShip(user.user, api, systems[0].symbol);
        const purchasedFuel = await api.createUserPurchaseOrder({
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
        'jettisons cargo',
        async () => {
            const jettison = await api.jettisonShipCargo({
                username: user.user.username,
                shipId: shipA.id,
                jettisonShipCargoPayload: {
                    good: 'FUEL',
                    quantity: 13,
                },
            });

            expect(jettison.data.good).toBe('FUEL');
            expect(jettison.data.quantityRemaining).toBe(37);
        },
        TEST_TIMEOUT,
    );

    it(
        'transfers cargo',
        async () => {
            const transfer = await api.transferShipCargo({
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
