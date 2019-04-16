/* tslint:disable */

declare var Object: any;
export interface MembershipTypeInterface {
  "label": string;
  "id"?: number;
}

export class MembershipType implements MembershipTypeInterface {
  "label": string;
  "id": number;
  constructor(data?: MembershipTypeInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `MembershipType`.
   */
  public static getModelName() {
    return "MembershipType";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of MembershipType for dynamic purposes.
  **/
  public static factory(data: MembershipTypeInterface): MembershipType{
    return new MembershipType(data);
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
      name: 'MembershipType',
      plural: 'MembershipTypes',
      path: 'MembershipTypes',
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
