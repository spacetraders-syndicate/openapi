import { DefaultApi as API } from '../../../src/sdk';


const TEST_TIMEOUT = 10000;

describe('fetch game status', () => {
  let api: API;

  beforeAll(async () => {
    api = new API();
  });

  it(
    'fetches status',
    async () => {
        const status = await api.getGameStatus();
        expect(status.data.status).toContain("available")
    },
    TEST_TIMEOUT
  );
});
