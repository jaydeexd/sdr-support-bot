type Props = {
  onSelect: (text: string) => void;
};

const CHIPS = [
  "What segment is a company with 800 employees?",
  "Lead stayed in my name — full checklist",
  "30-day rule — can I work this lead?",
  "Demo is in 2 hours and AE isn't responding",
  "China lead — commercial or GE?",
  "Japan lead assigned to me",
  "Prospect wants fewer than 21 seats",
  "Lead from a departed rep — what do I do?",
  "Which AE is next on the Commercial rotation?",
  "Pricing objection on first call",
  "Timing objection — they want to wait",
  "Nurture re-engagement steps",
];

export default function SuggestedChips({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 pb-8">
      <div className="mb-6 text-center">
        <p className="text-gray-500 text-sm">Ask me anything — or pick a question to get started:</p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => onSelect(chip)}
            className="px-4 py-2 rounded-full border border-[#5624d0] text-[#5624d0] text-sm hover:bg-[#f0ebff] transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
