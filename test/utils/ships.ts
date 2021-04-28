import { DefaultApi as API, Ship, User, System } from '../../src/sdk';

export async function buyCheapestShip(user: User, api: API, systemSymbol?: System["symbol"]): Promise<Ship> {
    let { data: { ships }} = await api.listGamePurchasableShips();

    // filter to only ship purchase options from a particular system
    if(systemSymbol){
        ships = ships.map((ship) => {
            ship.purchaseLocations = ship.purchaseLocations.filter((location) => {
                return location.system == systemSymbol
            })
            return ship
        }).filter((ship) => {
            return ship.purchaseLocations.length > 0
        })
    }
    
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
