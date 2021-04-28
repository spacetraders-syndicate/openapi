import { Configuration, LoansApi } from '../../../src/sdk';
import { newUserAndConfiguration, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('loans', () => {
    let config: Configuration;
    let user: User;

    beforeAll(async () => {
        const response = await newUserAndConfiguration();
        config = response.config;
        user = response.user;
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'fetches available loans',
        async () => {
            const {
                data: { loans },
            } = await new LoansApi(config).listGameLoans();
            expect(loans.length).toBeGreaterThanOrEqual(0);
            expect(loans[0].amount).toBeGreaterThan(0);
        },
        TEST_TIMEOUT,
    );
});
