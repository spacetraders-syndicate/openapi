import { Configuration, UserShip, User, System, ShipsApi, SystemsApi } from '../../src/sdk';
import { sleep } from './sleep';

export async function buyCheapestShip(
    user: User,
    config: Configuration,
    systemSymbol?: System['symbol'],
): Promise<UserShip> {
    await sleep(1);
    const shipsClient = new ShipsApi(config);
    const systemsClient = new SystemsApi(config);
    const { data: { systems }} = await systemsClient.listGameSystems();
    if(!systemSymbol){
        systemSymbol = systems[0].symbol
    }

    let {
        data: { shipListings },
    } = await shipsClient.listSystemShipListings({
        symbol: systemSymbol
    });
    const cheapestShip = shipListings!.reduce((prev, curr) => {
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
        buyUserShipPayload: {
            type: cheapestShip.type,
            location: cheapestShip.purchaseLocations.reduce((prev, curr) => {
                return prev.price < curr.price ? prev : curr;
            }).location,
        },
    });
    return ship;
}
