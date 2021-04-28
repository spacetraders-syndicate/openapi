import { DefaultApi as API } from '../../../src/sdk';
import { newUserAndApiClient, User } from '../../utils'


const TEST_TIMEOUT = 10000;

describe('loans', () => {
  let api: API;
  let user: User;

  beforeAll(async () => {
    const response = await newUserAndApiClient();
    api = response.api;
    user = response.user;
  });

  it(
    'fetches available loans',
    async () => {
        const { data: { loans }} = await api.listGameLoans();
        expect(loans.length).toBeGreaterThanOrEqual(0)
        expect(loans[0].amount).toBeGreaterThan(0)
    },
    TEST_TIMEOUT
  );
});
