import { Configuration, Ship, StructuresApi, System } from '../../../src/sdk';
import { newUserAndConfigAcceptedLoan, sleep, User } from '../../utils';

const TEST_TIMEOUT = 10000;

describe('user structures', () => {
    let config: Configuration;
    let user: User;
    let ship: Ship;
    let systems: System[];

    beforeAll(async () => {
        const response = await newUserAndConfigAcceptedLoan();
        config = response.config;
        user = response.user;
    });

    beforeEach(async () => {
        await sleep();
    }, TEST_TIMEOUT);

    it(
        'list structures',
        async () => {
            const {
                data: { structures },
            } = await new StructuresApi(config).listUserStructures({
                username: user.user.username,
            });

            expect(structures.length).toBeGreaterThanOrEqual(0);
        },
        TEST_TIMEOUT,
    );
});
