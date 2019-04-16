/* tslint:disable */

declare var Object: any;
export interface DebtInterface {
  "date"?: string;
  "agirheCode"?: string;
  "dissolved"?: boolean;
  "amount"?: string;
  "createdAt"?: Date;
  "id"?: number;
}

export class Debt implements DebtInterface {
  "date": string;
  "agirheCode": string;
  "dissolved": boolean;
  "amount": string;
  "createdAt": Date;
  "id": number;
  constructor(data?: DebtInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Debt`.
   */
  public static getModelName() {
    return "Debt";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Debt for dynamic purposes.
  **/
  public static factory(data: DebtInterface): Debt{
    return new Debt(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Debt',
      plural: 'Debts',
      path: 'Debts',
      idName: 'id',
      properties: {
        "date": {
          name: 'date',
          type: 'string'
        },
        "agirheCode": {
          name: 'agirheCode',
          type: 'string'
        },
        "dissolved": {
          name: 'dissolved',
          type: 'boolean'
        },
        "amount": {
          name: 'amount',
          type: 'string'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
