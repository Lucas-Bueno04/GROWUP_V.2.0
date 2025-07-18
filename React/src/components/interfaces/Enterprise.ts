import { Size } from "recharts/types/util/types";

export interface Enterprise {
  id: number;
  cnpj: string;
  corporateName: string;
  tradeName: string;
  phone: string;
  email: string;
  size: Size;
  sector: string;
  region: string;
  invoicing: number;
  taxRegime: string;
}