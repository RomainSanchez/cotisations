/* tslint:disable */

declare var Object: any;
export interface CommunityInterface {
  "address"?: string;
  "agirheCode": string;
  "postcode"?: string;
  "email"?: string;
  "label"?: string;
  "siret"?: string;
  "personInCharge"?: string;
  "city"?: string;
  "createdAt"?: Date;
  "periodicity"?: number;
  "id"?: number;
}

export class Community implements CommunityInterface {
  "address": string;
  "agirheCode": string;
  "postcode": string;
  "email": string;
  "label": string;
  "siret": string;
  "personInCharge": string;
  "city": string;
  "createdAt": Date;
  "periodicity": number;
  "id": number;
  constructor(data?: CommunityInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Community`.
   */
  public static getModelName() {
    return "Community";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Community for dynamic purposes.
  **/
  public static factory(data: CommunityInterface): Community{
    return new Community(data);
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
      name: 'Community',
      plural: 'Communities',
      path: 'Communities',
      idName: 'id',
      properties: {
        "address": {
          name: 'address',
          type: 'string'
        },
        "agirheCode": {
          name: 'agirheCode',
          type: 'string'
        },
        "postcode": {
          name: 'postcode',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "label": {
          name: 'label',
          type: 'string'
        },
        "siret": {
          name: 'siret',
          type: 'string'
        },
        "personInCharge": {
          name: 'personInCharge',
          type: 'string'
        },
        "city": {
          name: 'city',
          type: 'string'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
        },
        "periodicity": {
          name: 'periodicity',
          type: 'number'
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
