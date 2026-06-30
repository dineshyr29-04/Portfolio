import React from 'react';
import './SocialLinks.css';

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="social-icon" aria-hidden>
    {children}
  </span>
);

export default function SocialLinks() {
  return (
    <div className="social-links-wrapper">
      <div className="social-links" role="navigation" aria-label="Social links">
      <a
        href="https://github.com/dineshyr29-04"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <Icon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.11.77-.25.77-.55 0-.27-.01-1-.02-1.95-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.27-1.7-1.27-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.75.4-1.25.72-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.52-1.47.11-3.06 0 0 .96-.31 3.14 1.18a10.9 10.9 0 0 1 2.86-.39c.97 0 1.95.13 2.86.39 2.17-1.49 3.13-1.18 3.13-1.18.63 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.43-2.71 5.4-5.29 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.77-.01 3.15 0 .3.2.66.78.55C20.71 21.39 24 17.08 24 12c0-6.35-5.15-11.5-12-11.5z" />
          </svg>
        </Icon>
      </a>
      <a
        href="https://www.linkedin.com/in/dinesha291204/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <Icon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.99 1.98 1.99 1.1 0 1.98-.89 1.98-1.99C6.96 4.38 6.08 3.5 4.98 3.5zM3.5 8.98h3v11.52h-3V8.98zM9.5 8.98h2.87v1.57h.04c.4-.76 1.38-1.57 2.84-1.57 3.04 0 3.6 2.01 3.6 4.62v6.9h-3v-6.11c0-1.46-.03-3.34-2.03-3.34-2.03 0-2.34 1.58-2.34 3.22v6.23h-3V8.98z" />
          </svg>
        </Icon>
      </a>
      <a
        href="https://twitter.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter"
      >
        <Icon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.36 8.54 8.54 0 0 1-2.71 1.04 4.26 4.26 0 0 0-7.27 3.88A12.1 12.1 0 0 1 3.16 4.6a4.26 4.26 0 0 0 1.32 5.69c-.66-.02-1.28-.2-1.82-.5v.05a4.26 4.26 0 0 0 3.42 4.18c-.31.08-.64.12-.98.12-.24 0-.47-.02-.7-.06a4.27 4.27 0 0 0 3.98 2.96 8.55 8.55 0 0 1-5.3 1.83c-.34 0-.67-.02-1-.06A12.07 12.07 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.69 0-.18-.01-.36-.02-.54A8.36 8.36 0 0 0 22.46 6z" />
          </svg>
        </Icon>
      </a>
      <a href="mailto:hello@dineshav.vercel.app" aria-label="Email">
        <Icon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 13.065L.5 4.5V19.5A2 2 0 0 0 2.5 21.5h19a2 2 0 0 0 2-2V4.5L12 13.065zM12 10.5L23.5 2.5h-23L12 10.5z" />
          </svg>
        </Icon>
      </a>
      </div>
      <div className="hackathons" aria-label="Hackathons and projects">
        <h4>Hackathons & Projects</h4>
        <p>
          I regularly build and ship prototypes at hackathons — check out my
          hackathon projects on GitHub.
        </p>
        <a
          href="https://github.com/search?q=user%3Adineshyr29-04+topic%3Ahackathon&type=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          View hackathon projects
        </a>
      </div>
    </div>
  );
}
