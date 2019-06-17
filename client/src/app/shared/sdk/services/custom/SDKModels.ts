/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Community } from '../../models/Community';
import { Periodicity } from '../../models/Periodicity';
import { Payment } from '../../models/Payment';
import { Import } from '../../models/Import';
import { Comment } from '../../models/Comment';
import { Agent } from '../../models/Agent';
import { Debt } from '../../models/Debt';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Community: Community,
    Periodicity: Periodicity,
    Payment: Payment,
    Import: Import,
    Comment: Comment,
    Agent: Agent,
    Debt: Debt,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
