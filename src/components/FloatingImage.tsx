import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  size?: number;
  startSelector?: string;
  targetSelectors?: string[];
  className?: string;
};

export default function FloatingImage({
  src,
  size = 120,
  startSelector = "#hero",
  targetSelectors = ["#about"],
  className = "",
}: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const img = imgRef.current;
    if (!img) return;
    const imgEl = img;

    const startEl = document.querySelector(startSelector) as HTMLElement | null;
    const targets = targetSelectors
      .map((s) => document.querySelector(s) as HTMLElement | null)
      .filter(Boolean) as HTMLElement[];
    if (!startEl || targets.length === 0) return;
    const startElEl = startEl;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    svg.style.left = "-9999px";
    svg.style.top = "-9999px";
    const path = document.createElementNS(svgNS, "path");
    svg.appendChild(path);
    document.body.appendChild(svg);
    svgRef.current = svg;

    function makePath(sx: number, sy: number, ex: number, ey: number) {
      const dx = ex - sx;
      const dy = ey - sy;
      const cp1x = sx + dx * 0.25;
      const cp1y = sy - Math.abs(dy) * 0.4 - 120;
      const cp2x = sx + dx * 0.75;
      const cp2y = ey - Math.abs(dy) * 0.4 - 80;
      return `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`;
    }

    let raf = 0;

    function update() {
      const scrollY = window.scrollY || window.pageYOffset;
      // choose next target
      const nextTarget =
        targets.find((t) => t.getBoundingClientRect().top + window.scrollY - 10 > scrollY) ??
        targets[targets.length - 1];

      const startRect = startElEl.getBoundingClientRect();
      const startX = startRect.left + startRect.width * 0.6 + window.scrollX;
      const startY = startRect.top + startRect.height * 0.6 + window.scrollY;

      const targetRect = nextTarget.getBoundingClientRect();
      const endX = targetRect.left + targetRect.width * 0.5 + window.scrollX;
      const endY = targetRect.top + targetRect.height * 0.3 + window.scrollY;

      const d = makePath(startX, startY, endX, endY);
      path.setAttribute("d", d);
      const total = path.getTotalLength();

      const startScroll = Math.max(0, startRect.top + window.scrollY - window.innerHeight * 0.6);
      const endScroll = Math.max(startScroll + 1, targetRect.top + window.scrollY - window.innerHeight * 0.25);
      const progress = Math.min(1, Math.max(0, (scrollY - startScroll) / (endScroll - startScroll)));

      const point = path.getPointAtLength(total * progress);

      imgEl.style.transform = `translate(${point.x - window.scrollX}px, ${point.y - window.scrollY}px) translate(-50%,-50%) scale(${1 - 0.12 * progress})`;
      imgEl.style.opacity = `${0.9 - 0.4 * progress}`;

      raf = requestAnimationFrame(update);
    }

    raf = requestAnimationFrame(update);

    function onResize() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (svgRef.current) document.body.removeChild(svgRef.current);
      svgRef.current = null;
    };
  }, [startSelector, targetSelectors, reduced]);

  function handleClick() {
    const scrollY = window.scrollY || window.pageYOffset;
    const targets = targetSelectors
      .map((s) => document.querySelector(s) as HTMLElement | null)
      .filter(Boolean) as HTMLElement[];
    const next = targets.find((t) => t.getBoundingClientRect().top + window.scrollY - 10 > scrollY) ?? targets[targets.length - 1];
    next?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt="Floating visual"
      className={`floating-img ${className}`}
      width={size}
      height={size}
      role="button"
      tabIndex={0}
      aria-label="Navigate to next section"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      style={{
        position: "fixed",
        left: "50%",
        top: "20%",
        transform: "translate(-50%,-50%)",
        zIndex: 60,
        cursor: "pointer",
        transition: "opacity 220ms var(--anim-ease), transform 220ms var(--anim-ease)",
        willChange: "transform, opacity",
        pointerEvents: "auto",
      }}
    />
  );
}
