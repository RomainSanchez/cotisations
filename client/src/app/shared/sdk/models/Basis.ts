/* tslint:disable */

declare var Object: any;
export interface BasisInterface {
  "label": string;
  "id"?: number;
}

export class Basis implements BasisInterface {
  "label": string;
  "id": number;
  constructor(data?: BasisInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Basis`.
   */
  public static getModelName() {
    return "Basis";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Basis for dynamic purposes.
  **/
  public static factory(data: BasisInterface): Basis{
    return new Basis(data);
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
      name: 'Basis',
      plural: 'Bases',
      path: 'Bases',
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
