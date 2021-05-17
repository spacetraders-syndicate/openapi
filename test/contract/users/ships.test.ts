import { Configuration, PurchaseableShip, UserShip, ShipsApi, SystemsApi } from '../../../src/sdk';
import { buyCheapestShip, newUserAndConfigAcceptedLoan, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('user ships', () => {
    let config: Configuration;
    let user: User;
    let purchaseableShips: PurchaseableShip[];
    let purchasedShip: UserShip;

    beforeAll(async () => {
        const response = await newUserAndConfigAcceptedLoan();
        config = response.config;
        user = response.user;
        const { data: { systems }} = await new SystemsApi(config).listGameSystems();
        const {
            data: { shipListings },
        } = await new SystemsApi(config).listSystemShipListings({
            symbol: systems[0].symbol
        });
        purchaseableShips = shipListings!;
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'buys ship',
        async () => {
            purchasedShip = await buyCheapestShip(user.user, config)
            expect(purchasedShip.id).toBeDefined();
            expect(purchasedShip.manufacturer).toBeDefined();
        },
        TEST_TIMEOUT,
    );

    it(
        'list user ships',
        async () => {
            const userShips = await new ShipsApi(config).listUserShips();

            expect(userShips.data.ships.length).toBe(1);
            expect(userShips.data.ships[0].id).toBe(purchasedShip.id);
        },
        TEST_TIMEOUT,
    );

    it(
        'gets ship info',
        async () => {
            const shipInfo = await new ShipsApi(config).getUserShip({
               shipId: purchasedShip.id,
            });

            expect(shipInfo.data.ship.id).toBe(purchasedShip.id);
            expect(shipInfo.data.ship.location).toBeDefined();
        },
        TEST_TIMEOUT,
    );

    it(
        'scraps ship',
        async () => {
            const scrapedShip = await new ShipsApi(config).scrapUserShip({
                shipId: purchasedShip.id,
            });

            expect(scrapedShip.data.success).toContain('scrapped');
        },
        TEST_TIMEOUT,
    );
});
