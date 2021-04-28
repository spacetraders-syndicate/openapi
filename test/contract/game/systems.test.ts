import { DefaultApi as API } from '../../../src/sdk';
import { newUserAndApiClient, User } from '../../utils'


const TEST_TIMEOUT = 10000;

describe('systems', () => {
  let api: API;
  let user: User;

  beforeAll(async () => {
    const response = await newUserAndApiClient();
    api = response.api;
    user = response.user;
  });

  it(
    'fetches systems',
    async () => {
        const { data: { systems }} = await api.listGameSystems();
        expect(systems.length).toBeGreaterThan(0)
        expect(systems[0].locations.length).toBeGreaterThan(0);
        expect(systems[0].name).toBeDefined();
        expect(systems[0].symbol).toBeDefined();
    },
    TEST_TIMEOUT
  );
});
