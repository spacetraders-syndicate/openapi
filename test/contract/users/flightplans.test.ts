import { DefaultApi as API, Location, Ship, System } from '../../../src/sdk';
import { buyCheapestShip, newUserAndApiClientAcceptedLoan, sleep, User } from '../../utils';

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

    beforeEach(async () => {
        await sleep();
    });

    it(
        'creates flight plan',
        async () => {
            // first location that isn't where the ship is
            const destination = systems[0].locations.find((location) => {
                return location.symbol !== ship.location;
            }) as Location;

            const purchasedFuel = await api.createUserPurchaseOrder({
                username: user.user.username,
                createUserPurchaseOrderPayload: {
                    shipId: ship.id,
                    good: 'FUEL',
                    quantity: 50,
                },
            });

            const flightPlan = await api.createUserFlightPlan({
                username: user.user.username,
                createUserFlightPlanPayload: {
                    shipId: ship.id,
                    destination: destination.symbol,
                },
            });
            expect(flightPlan.data.flightPlan.departure).toBeDefined();
            expect(flightPlan.data.flightPlan.fuelConsumed).toBeGreaterThan(0);
        },
        TEST_TIMEOUT,
    );
});
