import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
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

const screenshots: Record<string, string> = {
  'Drug Secure': '/project-drug-secure.png',
  'ThinkNode Portal': '/project-thinknode.png',
  AgroNova: '/project-agro-nova.png',
  CardioNerve: '/project-cardio-nerve.png',
};

function ProjectVisual({ project }: { project: Project }) {
  if (project.featured)
    return (
      <div className="flagship-visual" aria-hidden="true">
        <span className="visual-caption">MAIN PROJECT / 01</span>
        <span className="flagship-monogram">
          e<span>.</span>
        </span>
        <span className="flagship-signature">EXAPROP</span>
      </div>
    );
  const screenshot = screenshots[project.name];
  if (screenshot)
    return (
      <div className="screenshot-preview">
        <img
          src={screenshot}
          alt={`${project.name} website preview`}
          loading="lazy"
          decoding="async"
          width="1920"
          height="1080"
        />
      </div>
    );
  const automation = project.name === 'Openloop';
  return (
    <div
      className={`workflow-preview ${automation ? 'workflow-preview--automation' : 'workflow-preview--platform'}`}
      aria-hidden="true"
    >
      <span className="visual-caption">
        {automation ? 'WORKFLOW ORCHESTRATION' : 'HACKATHON PLATFORM'}
      </span>
      <span className="visual-title">
        {automation ? 'openloop' : 'HackArena'}
        <span>_</span>
      </span>
      <div className="visual-flow">
        {(automation
          ? ['Event', 'Pipeline', 'Task']
          : ['Teams', 'Build', 'Review']
        ).map((node, index) => (
          <div key={node}>
            {index > 0 && <ArrowRight size={17} />}
            <span>
              <i />
              {node}
            </span>
          </div>
        ))}
      </div>
      <span className="visual-caption visual-caption--bottom">
        {automation
          ? 'CONNECT. COORDINATE. EXECUTE.'
          : 'FROM TEAM FORMATION TO JUDGING.'}
      </span>
    </div>
  );
}

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
            className={`collage-item collage-item--${index + 1 - (projects[0]?.featured ? 1 : 0)}${project.featured ? ' collage-item--featured' : ''}`}
            key={project.name}
            data-reveal
            data-reveal-delay={(index % 2) * 70}
          >
            <button
              className="collage-card"
              onClick={() => setActive(project)}
              aria-label={`Explore ${project.name}`}
              aria-haspopup="dialog"
            >
              <div className="collage-preview">
                <ProjectVisual project={project} />
                <span className="card-open">
                  <ArrowUpRight size={20} />
                </span>
                <span className="card-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="collage-caption">
                <div>
                  <span className="project-category">{project.category}</span>
                  <h3>{project.name}</h3>
                  {project.featured && (
                    <span className="featured-card-action">
                      Take a closer look <ArrowRight size={16} />
                    </span>
                  )}
                </div>
                <ArrowUpRight size={19} />
              </div>
              {project.summary && (
                <p className="collage-summary">{project.summary}</p>
              )}
              {project.stack && (
                <span className="collage-stack">{project.stack}</span>
              )}
            </button>
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
            <div className="dialog-preview">
              <ProjectVisual project={active} />
            </div>
            <div className="project-dialog-body">
              <span className="eyebrow">A CLOSER LOOK</span>
              <h2 id="project-dialog-title">{active.name}</h2>
              {active.detail && <p>{active.detail}</p>}
              {active.featured && !active.detail && (
                <p>For a walkthrough of Exaprop, get in touch.</p>
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
                    Ask me about Exaprop <ArrowUpRight size={16} />
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
