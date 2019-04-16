/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Community } from '../../models/Community';
import { MembershipType } from '../../models/MembershipType';
import { Periodicity } from '../../models/Periodicity';
import { Payment } from '../../models/Payment';
import { Import } from '../../models/Import';
import { Basis } from '../../models/Basis';
import { CommunityType } from '../../models/CommunityType';
import { Comment } from '../../models/Comment';
import { Agent } from '../../models/Agent';
import { Debt } from '../../models/Debt';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Community: Community,
    MembershipType: MembershipType,
    Periodicity: Periodicity,
    Payment: Payment,
    Import: Import,
    Basis: Basis,
    CommunityType: CommunityType,
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
