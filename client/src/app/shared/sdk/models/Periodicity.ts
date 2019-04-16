/* tslint:disable */

declare var Object: any;
export interface PeriodicityInterface {
  "label": string;
  "id"?: number;
}

export class Periodicity implements PeriodicityInterface {
  "label": string;
  "id": number;
  constructor(data?: PeriodicityInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Periodicity`.
   */
  public static getModelName() {
    return "Periodicity";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Periodicity for dynamic purposes.
  **/
  public static factory(data: PeriodicityInterface): Periodicity{
    return new Periodicity(data);
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
      name: 'Periodicity',
      plural: 'Periodicities',
      path: 'Periodicities',
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
