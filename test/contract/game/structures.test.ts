import { Configuration, StructuresApi } from '../../../src/sdk';
import { newUserAndConfigAcceptedLoan, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('game structures', () => {
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
        'fetches structures',
        async () => {
            const {
                data: { structures },
            } = await new StructuresApi(config).listGameStructures();
            expect(structures[0].price).toBeGreaterThan(0);
            expect(structures.length).toBeGreaterThan(0);
        },
        TEST_TIMEOUT,
    );
});
