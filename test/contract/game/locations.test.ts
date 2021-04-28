import { DefaultApi as API, System } from '../../../src/sdk';
import { buyCheapestShip, User, newUserAndApiClientAcceptedLoan, sleep } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('system locations', () => {
    let api: API;
    let user: User;
    let systems: System[];

    beforeAll(async () => {
        const response = await newUserAndApiClientAcceptedLoan();
        api = response.api;
        user = response.user;

        const {
            data: { systems: returnedSystems },
        } = await api.listGameSystems();
        systems = returnedSystems;
    });

    beforeEach(async () => {
        await sleep();
    });

    it(
        'fetches system locations',
        async () => {
            const {
                data: { locations },
            } = await api.listSystemLocations({
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
            } = await api.listSystemLocations({
                symbol: systems[0].symbol,
                allowsConstruction: true,
            });

            locationsAllowingConstruction.forEach((location) => {
                expect(location.allowsConstruction).toBe(true);
            });

            const {
                data: { locations: locationsTypeMoon },
            } = await api.listSystemLocations({
                symbol: systems[0].symbol,
                type: 'MOON',
            });

            locationsTypeMoon.forEach((location) => {
                expect(location.type).toBe('MOON');
            });
        },
        TEST_TIMEOUT,
    );

    it(
        'gets info about a location',
        async () => {
            const {
                data: { location },
            } = await api.getGameLocation({
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
            const ship = await buyCheapestShip(user.user, api);
            const {
                data: { location },
            } = await api.listGameLocationsShips({
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
        TEST_TIMEOUT,
    );
});
