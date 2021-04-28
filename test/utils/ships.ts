import { DefaultApi as API, Ship, User, System } from '../../src/sdk';
import { sleep } from './sleep';

export async function buyCheapestShip(user: User, api: API, systemSymbol?: System['symbol']): Promise<Ship> {
    await sleep(1);
    let {
        data: { ships },
    } = await api.listGamePurchasableShips();

    // filter to only ship purchase options from a particular system
    if (systemSymbol) {
        ships = ships
            .map((ship) => {
                ship.purchaseLocations = ship.purchaseLocations.filter((location) => {
                    return location.system == systemSymbol;
                });
                return ship;
            })
            .filter((ship) => {
                return ship.purchaseLocations.length > 0;
            });
    }

    const cheapestShip = ships.reduce((prev, curr) => {
        const previousShipLowestPriceLocation = prev.purchaseLocations.reduce((prev, curr) => {
            return prev.price < curr.price ? prev : curr;
        }).price;

        const currentShipLowstPriceLocation = curr.purchaseLocations.reduce((prev, curr) => {
            return prev.price < curr.price ? prev : curr;
        }).price;

        return previousShipLowestPriceLocation < currentShipLowstPriceLocation ? prev : curr;
    });

    const {
        data: { ship },
    } = await api.buyUserShip({
        username: user.username,
        buyUserShipPayload: {
            type: cheapestShip.type,
            location: cheapestShip.purchaseLocations.reduce((prev, curr) => {
                return prev.price < curr.price ? prev : curr;
            }).location,
        },
    });
    return ship;
}
