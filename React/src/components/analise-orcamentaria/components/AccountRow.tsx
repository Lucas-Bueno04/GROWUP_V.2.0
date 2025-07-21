interface AccountRowProps {
  id: number;
  cod: string;
  name: string;
  budgeted: number;
  carried: number;
}

export  function AccountRow({ cod, name, budgeted, carried }: AccountRowProps) {
  const diff = carried - budgeted;
  const diffColor = diff >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="flex justify-between items-center p-2 border rounded-md">
      <div>
        <span className="font-mono text-xs mr-2">{cod}</span>
        <span>{name}</span>
      </div>
      <div className="flex gap-4 min-w-[200px] justify-end font-mono text-sm">
        <span>Orçado: {budgeted.toFixed(2)}</span>
        <span>Realizado: {carried.toFixed(2)}</span>
        <span className={diffColor}>Dif: {diff.toFixed(2)}</span>
      </div>
    </div>
  );
}
