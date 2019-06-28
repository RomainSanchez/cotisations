/* tslint:disable */
import {
  Community,
  Payment
} from '../index';

declare var Object: any;
export interface DebtInterface {
  "date"?: string;
  "agirheCode"?: string;
  "dissolved"?: boolean;
  "amount"?: string;
  "createdAt"?: Date;
  "communityType"?: string;
  "basis"?: string;
  "type"?: string;
  "value"?: string;
  "id"?: number;
  "communityId"?: number;
  community?: Community;
  payments?: Payment[];
}

export class Debt implements DebtInterface {
  "date": string;
  "agirheCode": string;
  "dissolved": boolean;
  "amount": string;
  "createdAt": Date;
  "communityType": string;
  "basis": string;
  "type": string;
  "value": string;
  "id": number;
  "communityId": number;
  community: Community;
  payments: Payment[];
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
        "communityType": {
          name: 'communityType',
          type: 'string'
        },
        "basis": {
          name: 'basis',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "value": {
          name: 'value',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "communityId": {
          name: 'communityId',
          type: 'number'
        },
      },
      relations: {
        community: {
          name: 'community',
          type: 'Community',
          model: 'Community',
          relationType: 'belongsTo',
                  keyFrom: 'communityId',
          keyTo: 'id'
        },
        payments: {
          name: 'payments',
          type: 'Payment[]',
          model: 'Payment',
          relationType: 'hasMany',
          modelThrough: 'Match',
          keyThrough: 'paymentId',
          keyFrom: 'id',
          keyTo: 'debtId'
        },
      }
    }
  }
}
