/* tslint:disable */

declare var Object: any;
export interface AgentInterface {
  "activity"?: string;
  "birthDate"?: string;
  "grade"?: string;
  "firstName"?: string;
  "lastName"?: string;
  "maidenName"?: string;
  "createdAt"?: Date;
  "id"?: number;
}

export class Agent implements AgentInterface {
  "activity": string;
  "birthDate": string;
  "grade": string;
  "firstName": string;
  "lastName": string;
  "maidenName": string;
  "createdAt": Date;
  "id": number;
  constructor(data?: AgentInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Agent`.
   */
  public static getModelName() {
    return "Agent";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Agent for dynamic purposes.
  **/
  public static factory(data: AgentInterface): Agent{
    return new Agent(data);
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
      name: 'Agent',
      plural: 'Agents',
      path: 'Agents',
      idName: 'id',
      properties: {
        "activity": {
          name: 'activity',
          type: 'string'
        },
        "birthDate": {
          name: 'birthDate',
          type: 'string'
        },
        "grade": {
          name: 'grade',
          type: 'string'
        },
        "firstName": {
          name: 'firstName',
          type: 'string'
        },
        "lastName": {
          name: 'lastName',
          type: 'string'
        },
        "maidenName": {
          name: 'maidenName',
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
