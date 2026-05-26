import { Check } from "lucide-react";

function IntakeChoiceGrid({ items, value, onChange, columns = 2 }) {
  return (
    <div className="intake-choice-grid" data-columns={columns} role="listbox" aria-label="Choose one option">
      {items.map((item) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`intake-choice-btn${selected ? " selected" : ""}`}
            onClick={() => onChange(item.id)}
          >
            {item.icon ? <span className="intake-choice-icon">{item.icon}</span> : null}
            <span className="intake-choice-title">{item.title}</span>
            {item.desc ? <span className="intake-choice-desc">{item.desc}</span> : null}
            {selected ? (
              <span className="intake-choice-check" aria-hidden>
                <Check size={16} strokeWidth={2.5} />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export default IntakeChoiceGrid;
