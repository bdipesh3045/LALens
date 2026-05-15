import { Check } from "lucide-react";

function IntakeChoiceGrid({ items, value, onChange, columns = 2 }) {
  return (
    <ul className={`intake-matrix intake-matrix--${columns}`} role="listbox" aria-label="Choose one option">
      {items.map((item) => {
        const selected = value === item.id;
        return (
          <li key={item.id} role="option" aria-selected={selected}>
            <button
              type="button"
              className={`intake-tile${selected ? " selected" : ""}`}
              onClick={() => onChange(item.id)}
            >
              {item.icon ? <span className="intake-tile-icon">{item.icon}</span> : null}
              <span className="intake-tile-body">
                <strong>{item.title}</strong>
                {item.desc ? <span className="intake-tile-desc">{item.desc}</span> : null}
              </span>
              {selected ? (
                <span className="intake-tile-check" aria-hidden>
                  <Check size={14} strokeWidth={2.5} />
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default IntakeChoiceGrid;
