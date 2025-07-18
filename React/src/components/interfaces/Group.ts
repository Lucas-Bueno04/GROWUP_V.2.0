import exp from "constants";
import {Account} from "./Account";

export interface Group{
    id:number;
    cod:string;
    name:string;
    accounts:Account[];
}