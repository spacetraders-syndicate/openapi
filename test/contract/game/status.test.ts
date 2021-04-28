import { GameApi } from '../../../src/sdk';
import { sleep } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('fetch game status', () => {
    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'fetches status',
        async () => {
            const status = await new GameApi().getGameStatus();
            expect(status.data.status).toContain('available');
        },
        TEST_TIMEOUT,
    );
});
