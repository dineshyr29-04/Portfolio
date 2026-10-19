import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import './ProjectGallery.css';

type Project = {
  name: string;
  category: string;
  summary: string;
  stack: string;
  source: string;
  live: string;
  detail: string;
  featured?: boolean;
};

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !active) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  return (
    <>
      <div className="gallery-guide">
        <span>PROJECT INDEX / {String(projects.length).padStart(2, '0')}</span>
        <span>
          Select a project to look inside <ArrowUpRight size={13} />
        </span>
      </div>
      <div className="project-collage">
        {projects.map((project, index) => (
          <article
            className={`collage-item${project.featured ? ' collage-item--featured' : ''}`}
            key={project.name}
            data-reveal
            data-reveal-delay={(index % 2) * 70}
          >
            <div className="collage-card">
              <span className="card-meta">
                <span className="card-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="card-category">{project.category}</span>
                <span className="card-open">
                  <ArrowUpRight size={19} />
                </span>
              </span>
              <div className="card-body">
                <h3>{project.name}</h3>
                {project.summary && (
                  <p
                    className="collage-summary"
                    id={`project-summary-${index}`}
                  >
                    {project.summary}
                  </p>
                )}
              </div>
              <span className="card-footer">
                <span className="card-tools">
                  {project.stack
                    .split(' · ')
                    .filter(Boolean)
                    .map(tool => (
                      <span key={tool}>{tool}</span>
                    ))}
                </span>
                <span className="card-details-label">
                  View project <ArrowUpRight size={13} />
                </span>
              </span>
              <button
                type="button"
                className="card-hit-area"
                onClick={() => setActive(project)}
                aria-label={`Explore ${project.name}`}
                aria-describedby={
                  project.summary ? `project-summary-${index}` : undefined
                }
                aria-haspopup="dialog"
              />
            </div>
          </article>
        ))}
      </div>
      <dialog
        className="project-dialog"
        ref={dialogRef}
        aria-labelledby="project-dialog-title"
        onCancel={() => setActive(null)}
        onClose={() => setActive(null)}
        onClick={event => {
          if (event.target === event.currentTarget) setActive(null);
        }}
      >
        {active && (
          <div className="project-dialog-content">
            <div className="project-dialog-top">
              <span className="micro-label">PROJECT / {active.category}</span>
              <button
                autoFocus
                className="dialog-close"
                onClick={() => setActive(null)}
                aria-label="Close project"
              >
                <X size={20} />
              </button>
            </div>
            <div className="project-dialog-body">
              <span className="eyebrow">A CLOSER LOOK</span>
              <h2 id="project-dialog-title">{active.name}</h2>
              {active.detail && <p>{active.detail}</p>}
              {active.featured && !active.detail && (
                <p>For a walkthrough of {active.name}, get in touch.</p>
              )}
              {active.stack && (
                <div className="dialog-tools">
                  <span className="micro-label">BUILT WITH</span>
                  <p>{active.stack}</p>
                </div>
              )}
              <div className="dialog-links">
                {active.live && (
                  <a
                    className="primary-link"
                    href={active.live}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open live project <ArrowUpRight size={16} />
                  </a>
                )}
                {active.source && (
                  <a
                    className="text-link"
                    href={active.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View source <ArrowUpRight size={16} />
                  </a>
                )}
                {active.featured && !active.live && !active.source && (
                  <a
                    className="primary-link"
                    href="mailto:dineshyr2904@gmail.com?subject=Exaprop%20project"
                  >
                    Ask me about {active.name} <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
