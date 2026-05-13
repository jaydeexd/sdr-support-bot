type Props = {
  onSelect: (text: string) => void;
};

const CATEGORIES = [
  {
    label: "SFDC",
    chips: [
      "What segment is a company with 800 employees?",
      "Lead stayed in my name — full checklist",
      "China lead — commercial or GE?",
      "Japan lead assigned to me",
      "Which AE is next on the Commercial rotation?",
    ],
  },
  {
    label: "Rules of Engagement",
    chips: [
      "30-day rule — can I work this lead?",
      "Lead from a departed rep — what do I do?",
      "Nurture re-engagement steps",
      "Demo is in 2 hours and AE isn't responding",
      "My situation isn't in the playbook — what's closest?",
    ],
  },
  {
    label: "Discovery Process",
    chips: [
      "Prospect wants fewer than 21 seats",
      "Pricing objection on first call",
      "Timing objection — they want to wait",
    ],
  },
];

export default function SuggestedChips({ onSelect }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <p className="text-gray-500 text-sm text-center mb-6">
        Ask me anything — or pick a question to get started:
      </p>
      <div className="flex flex-col gap-5">
        {CATEGORIES.map((category) => (
          <div key={category.label}>
            <p className="text-xs font-semibold text-[#5624d0] uppercase tracking-wider mb-2 px-1">
              {category.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {category.chips.map((chip) => (
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
        ))}
      </div>
    </div>
  );
}
