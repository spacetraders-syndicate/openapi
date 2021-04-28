import { DefaultApi as API, Ship, User } from '../../src/sdk';

export async function buyCheapestShip(user: User, api: API): Promise<Ship> {
    const { data: { ships }} = await api.listGamePurchasableShips();
    const cheapestShip = ships.reduce((prev, curr) => {
        return prev.purchaseLocations.reduce((prev, curr) => {
            return prev.price < curr.price ? prev : curr
        }) < curr.purchaseLocations.reduce((prev, curr) => {
         return prev.price < curr.price ? prev : curr
     }) ? prev : curr
    })

    const { data: { ship }} = await api.buyUserShip({
        username: user.username,
        buyUserShipPayload: {
            type: cheapestShip.type,
            location: cheapestShip.purchaseLocations.reduce((prev, curr) => {
             return prev.price < curr.price ? prev : curr
         }).location
        }
    })
    return ship;
}
