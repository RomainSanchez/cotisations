/* tslint:disable */

declare var Object: any;
export interface ImportInterface {
  "file": string;
  "createdAt"?: Date;
  "id"?: number;
}

export class Import implements ImportInterface {
  "file": string;
  "createdAt": Date;
  "id": number;
  constructor(data?: ImportInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Import`.
   */
  public static getModelName() {
    return "Import";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Import for dynamic purposes.
  **/
  public static factory(data: ImportInterface): Import{
    return new Import(data);
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
      name: 'Import',
      plural: 'Imports',
      path: 'Imports',
      idName: 'id',
      properties: {
        "file": {
          name: 'file',
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
