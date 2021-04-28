import { DefaultApi as API, PurchaseableShip, Ship } from '../../../src/sdk';
import { newUserAndApiClientAcceptedLoan, User } from '../../utils'


const TEST_TIMEOUT = 10000;

describe('user ships', () => {
  let api: API;
  let user: User;
  let purchaseableShips: PurchaseableShip[];
  let purchasedShip: Ship;

  beforeAll(async () => {
    const response = await newUserAndApiClientAcceptedLoan();
    api = response.api;
    user = response.user;
    const { data: { ships }} = await api.listGamePurchasableShips();
    purchaseableShips = ships;
  });

  it(
    'buys ship',
    async () => {
       const cheapestShip = purchaseableShips.reduce((prev, curr) => {
           return prev.purchaseLocations.reduce((prev, curr) => {
               return prev.price < curr.price ? prev : curr
           }) < curr.purchaseLocations.reduce((prev, curr) => {
            return prev.price < curr.price ? prev : curr
        }) ? prev : curr
       })

       const { data: { ship }} = await api.buyUserShip({
           username: user.user.username,
           buyUserShipPayload: {
               type: cheapestShip.type,
               location: cheapestShip.purchaseLocations.reduce((prev, curr) => {
                return prev.price < curr.price ? prev : curr
            }).location
           }
       })

       purchasedShip = ship;
       expect(ship.id).toBeDefined();
       expect(ship.manufacturer).toBeDefined();
    },
    TEST_TIMEOUT
  );

  it(
    'list user ships',
    async () => {
        const userShips = await api.listUserShips({
            username: user.user.username
        })
        
        expect(userShips.data.ships.length).toBe(1);
        expect(userShips.data.ships[0].id).toBe(purchasedShip.id);
    },
    TEST_TIMEOUT
  );

  it(
    'gets ship info',
    async () => {
        const shipInfo = await api.getUserShip({
            username: user.user.username,
            shipId: purchasedShip.id
        })
        
        expect(shipInfo.data.ship.id).toBe(purchasedShip.id);
        expect(shipInfo.data.ship.location).toBeDefined();
    },
    TEST_TIMEOUT
  );

  it(
    'scraps ship',
    async () => {
        const scrapedShip = await api.scrapUserShip({
            username: user.user.username,
            shipId: purchasedShip.id
        })

        expect(scrapedShip.data.success).toContain("scrapped");
    },
    TEST_TIMEOUT
  );
});
