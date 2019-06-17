/* tslint:disable */
import {
  Community,
  Import
} from '../index';

declare var Object: any;
export interface PaymentInterface {
  "date": string;
  "label": string;
  "debit": string;
  "credit"?: string;
  "valueDate"?: string;
  "createdAt"?: Date;
  "id"?: number;
  "communityId"?: number;
  "importId"?: number;
  community?: Community;
  import?: Import;
}

export class Payment implements PaymentInterface {
  "date": string;
  "label": string;
  "debit": string;
  "credit": string;
  "valueDate": string;
  "createdAt": Date;
  "id": number;
  "communityId": number;
  "importId": number;
  community: Community;
  import: Import;
  constructor(data?: PaymentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Payment`.
   */
  public static getModelName() {
    return "Payment";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Payment for dynamic purposes.
  **/
  public static factory(data: PaymentInterface): Payment{
    return new Payment(data);
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
      name: 'Payment',
      plural: 'Payments',
      path: 'Payments',
      idName: 'id',
      properties: {
        "date": {
          name: 'date',
          type: 'string'
        },
        "label": {
          name: 'label',
          type: 'string'
        },
        "debit": {
          name: 'debit',
          type: 'string'
        },
        "credit": {
          name: 'credit',
          type: 'string'
        },
        "valueDate": {
          name: 'valueDate',
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
        "communityId": {
          name: 'communityId',
          type: 'number'
        },
        "importId": {
          name: 'importId',
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
        import: {
          name: 'import',
          type: 'Import',
          model: 'Import',
          relationType: 'belongsTo',
                  keyFrom: 'importId',
          keyTo: 'id'
        },
      }
    }
  }
}
