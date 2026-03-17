import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Lenis from '@studio-freight/lenis'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize Lenis for smoother, native-feeling scrolling on all devices
const lenis = new (Lenis as any)({
  duration: 1.4,
  easing: (t: number) => 1 - Math.pow(1 - t, 3),
  smoothTouch: true,
  lerp: 0.06,
  touchMultiplier: 1,
})

// Expose Lenis globally so app code can use `window.lenis.scrollTo(...)` for anchor clicks
;(window as any).lenis = lenis

// Disable native smooth scrolling to avoid conflicting behavior
document.documentElement.style.scrollBehavior = 'auto'

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
