import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import './MobileNavigation.css';

export default function MobileNavigation({ items }: { items: string[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    const desktop = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = () => {
      if (desktop.matches) dialog.close();
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      desktop.removeEventListener('change', closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    dialogRef.current?.close();
    window.history.pushState(null, '', `#${id}`);
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }

  return (
    <>
      <button
        type="button"
        className="mobile-menu-trigger"
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        Menu <Menu size={18} aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="mobile-menu"
        aria-labelledby="mobile-menu-title"
        onClose={() => setOpen(false)}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            dialogRef.current?.close();
        }}
      >
        <div className="mobile-menu-heading">
          <div>
            <span className="micro-label">DINESH A. / PORTFOLIO</span>
            <h2 id="mobile-menu-title">Explore.</h2>
          </div>
          <button
            type="button"
            className="mobile-menu-close"
            aria-label="Close navigation menu"
            onClick={() => dialogRef.current?.close()}
          >
            <X size={21} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="mobile-menu-links">
          {items.map((item, index) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              data-section-link
              onClick={event => navigate(event, item.toLowerCase())}
            >
              <span className="mobile-menu-number">0{index + 1}</span>
              <span>{item}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div className="mobile-menu-footer">
          <span className="micro-label">A CLOSER LOOK</span>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            View résumé <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </dialog>
    </>
  );
}
