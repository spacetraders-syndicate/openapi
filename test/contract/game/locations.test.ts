import { Configuration, LocationsApi, System, SystemsApi } from '../../../src/sdk';
import { buyCheapestShip, User, newUserAndConfigAcceptedLoan, sleep } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('system locations', () => {
    let config: Configuration;
    let user: User;
    let systems: System[];

    beforeAll(async () => {
        const response = await newUserAndConfigAcceptedLoan();
        config = response.config;
        user = response.user;

        const {
            data: { systems: returnedSystems },
        } = await new SystemsApi(config).listGameSystems();
        systems = returnedSystems;
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'fetches system locations',
        async () => {
            const {
                data: { locations },
            } = await new LocationsApi(config).listSystemLocations({
                symbol: systems[0].symbol,
            });
            expect(locations.length).toBeGreaterThanOrEqual(1);
            expect(locations[0].name).toBeDefined();
            expect(locations[0].x).toBeDefined();
        },
        TEST_TIMEOUT,
    );

    it(
        'fetches system locations by type and allowingConstruction',
        async () => {
            const {
                data: { locations: locationsAllowingConstruction },
            } = await new LocationsApi(config).listSystemLocations({
                symbol: systems[0].symbol,
                allowsConstruction: true,
            });

            locationsAllowingConstruction.forEach((location) => {
                expect(location.allowsConstruction).toBe(true);
            });

            await sleep();

            const {
                data: { locations: locationsTypeMoon },
            } = await new LocationsApi(config).listSystemLocations({
                symbol: systems[0].symbol,
                type: 'MOON',
            });

            locationsTypeMoon.forEach((location) => {
                expect(location.type).toBe('MOON');
            });
        },
        TEST_TIMEOUT * 2,
    );

    it(
        'gets info about a location',
        async () => {
            const {
                data: { location },
            } = await new LocationsApi(config).getGameLocation({
                symbol: systems[0].locations[0].symbol,
            });

            expect(location.symbol).toBe(systems[0].locations[0].symbol);
            expect(location.type).toBeDefined();
        },
        TEST_TIMEOUT,
    );

    it(
        'fetches location ships',
        async () => {
            const ship = await buyCheapestShip(user.user, config);
            sleep();
            const {
                data: { location },
            } = await new LocationsApi(config).listGameLocationsShips({
                symbol: ship.location,
            });
            expect(location.ships).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        shipId: ship.id,
                    }),
                ]),
            );
        },
        TEST_TIMEOUT * 2,
    );
});
