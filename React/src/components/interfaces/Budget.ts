import { MonthBudget } from "./MonthBudget";

export interface Budget{
  id:number
  year:number;
  enterpriseId:number;
  name:string;
  months:MonthBudget[];
}