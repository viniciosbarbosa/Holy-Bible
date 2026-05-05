import { BUILT_IN_TAGS } from "../constants/tags"; // Mova suas tags para um arquivo de constantes

export const Legend = () => {
  return (
    <div className="flex flex-wrap gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 text-xs">
      {Object.entries(BUILT_IN_TAGS).map(([key, tag]) => (
        <div key={key} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm border"
            style={{ backgroundColor: tag.bg, borderColor: tag.border }}
          />
          <span className="text-bible-muted">
            <strong style={{ color: tag.color }}>{tag.lbl}</strong>: {tag.desc}
          </span>
        </div>
      ))}
      {/* Itens Fixos de Status */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm border border-red-900 bg-red-950/50" />
        <span className="text-bible-muted">
          <strong className="text-red-500">FALTANDO</strong>: Clique para mudar
        </span>
      </div>
    </div>
  );
};
