import { DefaultApi as API } from '../../../src/sdk';
import { newUserAndApiClient, User } from '../../utils'


const TEST_TIMEOUT = 10000;

describe('ships', () => {
  let api: API;
  let user: User;

  beforeAll(async () => {
    const response = await newUserAndApiClient();
    api = response.api;
    user = response.user;
  });

  it(
    'fetches purchaseable ships',
    async () => {
        const { data: { ships }} = await api.listGamePurchasableShips();
        expect(ships.length).toBeGreaterThan(0);
        expect(ships[0].purchaseLocations.length).toBeGreaterThan(0);
    },
    TEST_TIMEOUT
  );

  it(
    'buys a ships',
    async () => {
        const { data: { ships }} = await api.listGamePurchasableShips();
        expect(ships.length).toBeGreaterThan(0);
        expect(ships[0].purchaseLocations.length).toBeGreaterThan(0);
    },
    TEST_TIMEOUT
  );
});
