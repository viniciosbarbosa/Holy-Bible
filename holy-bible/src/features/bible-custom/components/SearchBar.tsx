import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const SearchBar = ({ value, onChange }: Props) => {
  return (
    <div className="relative max-w-2xl mx-auto mb-12 px-4">
      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-bible-muted group-focus-within:text-bible-gold transition-colors"
          size={20}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquisar livro, fase ou tema..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-bible-parchment placeholder:text-bible-muted focus:outline-none focus:border-bible-gold/50 focus:bg-white/10 transition-all font-serif text-lg"
        />
      </div>
    </div>
  );
};
