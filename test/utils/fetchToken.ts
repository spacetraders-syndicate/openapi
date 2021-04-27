type User = {
    username: string;
    token:  string;
}

async function newUser(): Promise<User> {
    return Promise.resolve({
        username: 'test',
        token: 'test'
    })
}