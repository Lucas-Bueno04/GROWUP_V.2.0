
import { InfoTab } from "@/components/mentorado/tabs/InfoTab";
import { Mentorado } from "@/types/mentorado";

type InformacoesTabProps = {
  mentorado: Mentorado;
};

export function InformacoesTab({ mentorado }: InformacoesTabProps) {
  return <InfoTab mentorado={mentorado} />;
}
