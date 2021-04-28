import { Configuration, FlightPlansApi, UserShip, System, SystemsApi } from '../../../src/sdk';
import { buyCheapestShip, newUserAndConfigAcceptedLoan, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('flight plans', () => {
    let user: User;
    let ship: UserShip;
    let config: Configuration;
    let systems: System[];

    beforeAll(async () => {
        const response = await newUserAndConfigAcceptedLoan();
        user = response.user;
        config = response.config;
        const {
            data: { systems: systemsResponse },
        } = await await new SystemsApi(config).listGameSystems();

        systems = systemsResponse;
        ship = await buyCheapestShip(user.user, config, systems[0].symbol);
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'fetches flight plans',
        async () => {
            const {
                data: { flightPlans },
            } = await new FlightPlansApi(config).listGameSystemFlightPlans({
                symbol: systems[0].symbol,
            });
            expect(flightPlans.length).toBeGreaterThanOrEqual(0);
        },
        TEST_TIMEOUT,
    );
});
