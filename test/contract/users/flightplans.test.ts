import { Configuration, FlightPlansApi, Location, PurchaseOrdersApi, UserShip, System, SystemsApi } from '../../../src/sdk';
import { buyCheapestShip, newUserAndConfigAcceptedLoan, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('user flight plans', () => {
    let config: Configuration;
    let user: User;
    let ship: UserShip;
    let systems: System[];

    beforeAll(async () => {
        const response = await newUserAndConfigAcceptedLoan();
        config = response.config;
        user = response.user;
        const {
            data: { systems: systemsResponse },
        } = await new SystemsApi(config).listGameSystems();
        systems = systemsResponse;
        ship = await buyCheapestShip(user.user, config, systems[0].symbol);
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'creates flight plan',
        async () => {
            // first location that isn't where the ship is
            const destination = systems[0].locations.find((location) => {
                return location.symbol !== ship.location;
            }) as Location;

            const purchasedFuel = await new PurchaseOrdersApi(config).createUserPurchaseOrder({
                createUserPurchaseOrderPayload: {
                    shipId: ship.id,
                    good: 'FUEL',
                    quantity: 50,
                },
            });

            const flightPlan = await new FlightPlansApi(config).createUserFlightPlan({
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
