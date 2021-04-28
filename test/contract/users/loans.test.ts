import { DefaultApi as API } from '../../../src/sdk';
import { newUserAndApiClient, newUserAndApiClientAcceptedLoan, User } from '../../utils'


const TEST_TIMEOUT = 10000;

describe('user info', () => {
  let api: API;
  let user: User;

  beforeAll(async () => {
    const response = await newUserAndApiClientAcceptedLoan();
    api = response.api;
    user = response.user;
  });

  it(
    'fetches loans',
    async () => {
       const { data: { loans }} = await api.listUserLoans({
           username: user.user.username
       });
       expect(loans.length).toBe(1);
       expect(loans[0].status).toBe("CURRENT")
    },
    TEST_TIMEOUT
  );

  // todo: figure out how to pay off loan without playing game?
});
