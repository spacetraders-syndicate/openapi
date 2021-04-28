import { DefaultApi as API } from '../../../src/sdk';
import { newUserAndApiClient, User } from '../../utils'


const TEST_TIMEOUT = 10000;

describe('flight plans', () => {
  let api: API;
  let user: User;

  beforeAll(async () => {
    const response = await newUserAndApiClient();
    api = response.api;
    user = response.user;
  });

  it(
    'fetches flight plans',
    async () => {
        const { data: { systems }} = await api.listGameSystems();
        console.log(systems)
        const { data: { flightPlans }} = await api.listFlightPlans({
            symbol: systems[0].symbol
        });
        expect(flightPlans.length).toBeGreaterThanOrEqual(0)
    },
    TEST_TIMEOUT
  );
});
