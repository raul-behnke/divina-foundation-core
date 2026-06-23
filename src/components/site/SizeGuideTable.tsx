const ROWS = [
  { size: "PP", busto: "82–84", cintura: "62–64", quadril: "88–90" },
  { size: "P",  busto: "86–88", cintura: "66–68", quadril: "92–94" },
  { size: "M",  busto: "90–92", cintura: "70–72", quadril: "96–98" },
  { size: "G",  busto: "94–96", cintura: "74–76", quadril: "100–102" },
  { size: "GG", busto: "98–100", cintura: "78–80", quadril: "104–106" },
  { size: "G1", busto: "104–108", cintura: "84–88", quadril: "110–114" },
  { size: "G2", busto: "112–116", cintura: "92–96", quadril: "118–122" },
  { size: "G3", busto: "120–124", cintura: "100–104", quadril: "126–130" },
];

export function SizeGuideTable() {
  return (
    <div className="overflow-x-auto -mx-5 md:mx-0">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-background-soft text-left">
            <th className="px-4 py-3 font-display text-foreground">Tamanho</th>
            <th className="px-4 py-3 font-display text-foreground">Busto (cm)</th>
            <th className="px-4 py-3 font-display text-foreground">Cintura (cm)</th>
            <th className="px-4 py-3 font-display text-foreground">Quadril (cm)</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.size} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-display text-primary">{r.size}</td>
              <td className="px-4 py-3 text-foreground">{r.busto}</td>
              <td className="px-4 py-3 text-foreground">{r.cintura}</td>
              <td className="px-4 py-3 text-foreground">{r.quadril}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
