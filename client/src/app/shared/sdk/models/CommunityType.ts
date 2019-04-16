/* tslint:disable */

declare var Object: any;
export interface CommunityTypeInterface {
  "label"?: string;
  "id"?: number;
}

export class CommunityType implements CommunityTypeInterface {
  "label": string;
  "id": number;
  constructor(data?: CommunityTypeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CommunityType`.
   */
  public static getModelName() {
    return "CommunityType";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CommunityType for dynamic purposes.
  **/
  public static factory(data: CommunityTypeInterface): CommunityType{
    return new CommunityType(data);
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
      name: 'CommunityType',
      plural: 'CommunityTypes',
      path: 'CommunityTypes',
      idName: 'id',
      properties: {
        "label": {
          name: 'label',
          type: 'string'
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
