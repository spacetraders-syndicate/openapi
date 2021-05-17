import { Configuration, LoansApi } from '../../../src/sdk';
import { newUserAndConfigAcceptedLoan, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('user info', () => {
    let config: Configuration;
    let user: User;

    beforeAll(async () => {
        const response = await newUserAndConfigAcceptedLoan();
        config = response.config;
        user = response.user;
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'fetches loans',
        async () => {
            const {
                data: { loans },
            } = await new LoansApi(config).listUserLoans();
            expect(loans.length).toBe(1);
            expect(loans[0].status).toBe('CURRENT');
        },
        TEST_TIMEOUT,
    );

    // todo: figure out how to pay off loan without playing game?
});
