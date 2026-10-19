import { useRef, type CSSProperties, type PointerEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import './OptionWheel.css';

type Props = {
  items: string[];
  selected: number;
  onChange: (index: number) => void;
};

// Adapted from the supplied React Bits OptionWheel: controlled selection,
// native tabs, CSS easing, and no interception of page wheel/touch scrolling.
export default function OptionWheel({ items, selected, onChange }: Props) {
  const drag = useRef<{ y: number; index: number; id: number } | null>(null);
  const moved = useRef(false);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    moved.current = false;
    if (
      event.button !== 0 ||
      event.pointerType === 'touch' ||
      !window.matchMedia(
        '(min-width: 1001px) and (prefers-reduced-motion: no-preference)'
      ).matches
    )
      return;
    drag.current = { y: event.clientY, index: selected, id: event.pointerId };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start) return;
    const distance = event.clientY - start.y;
    if (Math.abs(distance) < 8 && !moved.current) return;
    moved.current = true;
    event.currentTarget.setPointerCapture(start.id);
    onChange(
      Math.max(
        0,
        Math.min(items.length - 1, start.index - Math.round(distance / 70))
      )
    );
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.current = null;
  }

  return (
    <div className="approach-wheel-container">
      <div
        className="focus-selector approach-wheel"
        role="tablist"
        aria-label="Engineering approach"
        aria-orientation="vertical"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={() => {
          drag.current = null;
        }}
      >
        {items.map((item, index) => (
          <button
            type="button"
            key={item}
            role="tab"
            id={`focus-tab-${index}`}
            aria-selected={selected === index}
            aria-controls="focus-panel"
            tabIndex={selected === index ? 0 : -1}
            style={
              {
                '--wheel-distance': index - selected,
                '--wheel-offset': Math.abs(index - selected),
              } as CSSProperties
            }
            onClick={event => {
              if (!moved.current || event.detail === 0) onChange(index);
            }}
            onKeyDown={event => {
              if (
                ![
                  'ArrowDown',
                  'ArrowUp',
                  'ArrowLeft',
                  'ArrowRight',
                  'Home',
                  'End',
                ].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? items.length - 1
                    : (selected +
                        (['ArrowDown', 'ArrowRight'].includes(event.key)
                          ? 1
                          : -1) +
                        items.length) %
                      items.length;
              onChange(next);
              document
                .getElementById(`focus-tab-${next}`)
                ?.focus({ preventScroll: true });
            }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="approach-wheel-hint" aria-hidden="true">
        CLICK OR DRAG / ↑ ↓ TO EXPLORE
      </p>
    </div>
  );
}
