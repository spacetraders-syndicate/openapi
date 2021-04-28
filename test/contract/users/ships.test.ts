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
    'scrap ship',
    async () => {
        
    },
    TEST_TIMEOUT
  );
});
