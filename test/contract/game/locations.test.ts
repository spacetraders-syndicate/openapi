import { DefaultApi as API } from '../../../src/sdk';
import { newUserAndApiClient, User } from '../../utils'


const TEST_TIMEOUT = 10000;

describe('system locations', () => {
  let api: API;
  let user: User;

  beforeAll(async () => {
    const response = await newUserAndApiClient();
    api = response.api;
    user = response.user;
  });

  it(
    'fetches system locations',
    async () => {
      const { data: { systems } } = await api.listGameSystems();
      const { data: { locations } } = await api.listSystemLocations({
        symbol: systems[0].symbol
      })
      expect(locations.length).toBeGreaterThanOrEqual(1)
      expect(locations[0].name).toBeDefined()
      expect(locations[0].x).toBeDefined()
    },
    TEST_TIMEOUT
  );
});
