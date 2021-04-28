import { UsersApi, LoansApi, CreateUserTokenResponse, Configuration } from '../../src/sdk';
import faker from 'faker';

export type User = CreateUserTokenResponse;

const basePath = process.env.PROD ? 'https://api.spacetraders.io' : 'https://staging.api.spacetraders.io';

export async function newUser(): Promise<User> {
    const configuration = new Configuration({
        basePath,
    });

    const usersClient = new UsersApi(configuration);
    const user = await usersClient.createUserToken({
        username: faker.datatype.uuid(),
    });
    return user.data;
}

export async function newUserAndConfiguration(
    user?: User,
): Promise<{
    user: User;
    config: Configuration;
}> {
    if (!user) user = await newUser();

    const config = new Configuration({
        accessToken: user.token,
        basePath,
    });

    return {
        user,
        config,
    };
}

export async function newUserAndConfigAcceptedLoan(
    user?: User,
): Promise<{
    user: User;
    config: Configuration;
}> {
    let response;
    if (!user) {
        response = await newUserAndConfiguration();
    } else {
        response = await newUserAndConfiguration(user);
    }
    const loansClient = new LoansApi(response.config);
    const {
        data: { loans },
    } = await loansClient.listGameLoans();
    await loansClient.createUserLoan({
        username: response.user.user.username,
        createUserLoanPayload: {
            type: loans[0].type,
        },
    });
    return response;
}
