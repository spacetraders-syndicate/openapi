import { DefaultApi as API, CreateUserTokenResponse, Configuration } from '../../src/sdk';
import faker from 'faker';

export type User = CreateUserTokenResponse

const basePath =  process.env.PROD ? 'https://api.spacetraders.io' : 'https://staging.api.spacetraders.io';

export async function newUser(): Promise<User> {
    const configuration = new Configuration({
        basePath,
    })

    const api = new API(configuration);
    const user = await api.createUserToken({
        username: faker.datatype.uuid()
    })
    return user.data;
}


export async function newUserAndApiClient(user?: User): Promise<{
    user: User,
    api: API
}> {
    if(!user) user = await newUser();

    const configuration = new Configuration({
        accessToken: user.token,
        basePath,
    })

    return {
        user,
        api: new API(configuration)
    }
}


export async function newUserAndApiClientAcceptedLoan(user?: User): Promise<{
    user: User,
    api: API
}> {
    let response;
    if(!user){
        response = await newUserAndApiClient();
    } else {
        response = await newUserAndApiClient(user)
    }
    const { data: { loans } } = await response.api.listGameLoans();
    await response.api.createUserLoan({
        username: response.user.user.username,
        createUserLoanPayload: {
            type: loans[0].type
        }
    })
    return response;
}