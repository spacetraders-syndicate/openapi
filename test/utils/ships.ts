import { Configuration, UserShip, User, System, ShipsApi } from '../../src/sdk';
import { sleep } from './sleep';

export async function buyCheapestShip(
    user: User,
    config: Configuration,
    systemSymbol?: System['symbol'],
): Promise<UserShip> {
    await sleep(1);
    const shipsClient = await new ShipsApi(config);
    let {
        data: { ships },
    } = await shipsClient.listGamePurchasableShips();

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
    } = await shipsClient.buyUserShip({
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
