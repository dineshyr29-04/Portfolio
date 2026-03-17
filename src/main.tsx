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
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1 - Math.pow(1 - t, 3)),
  smoothTouch: true,
  lerp: 0.08,
})

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
