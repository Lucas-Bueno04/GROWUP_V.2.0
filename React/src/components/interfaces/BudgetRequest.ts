import { MonthBudget } from "./MonthBudget";

export interface BudgetRequest{
  year:number;
  enterpriseId:number;
  name:string;
  months:MonthBudget[];
}