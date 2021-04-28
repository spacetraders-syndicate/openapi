import { Configuration, MarketplaceApi, UserShip, System, SystemsApi } from '../../../src/sdk';
import { buyCheapestShip, User, newUserAndConfigAcceptedLoan, sleep } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('system locations', () => {
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
        'gets marketplace',
        async () => {
            const {
                data: { location },
            } = await new MarketplaceApi(config).getGameLocationMarketplace({
                symbol: ship.location,
            });
            expect(location.marketplace.length).toBeGreaterThan(0);
            expect(location.marketplace[0].pricePerUnit).toBeGreaterThan(0);
        },
        TEST_TIMEOUT,
    );
});
