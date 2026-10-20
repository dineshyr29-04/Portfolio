import { useCallback, useId, useState } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import ExpandableProjectDialog from './ExpandableProjectDialog';
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
  const id = useId();
  const reduceMotion = useReducedMotion();
  const close = useCallback(() => setActive(null), []);
  const sharedId = (part: string, project: Project) =>
    reduceMotion ? undefined : `${id}-${part}-${project.name}`;

  return (
    <LayoutGroup id={id}>
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
            <motion.div
              className="collage-card"
              layoutId={sharedId('card', project)}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              style={{ borderRadius: 12, cursor: 'pointer' }}
              onClick={() => setActive(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActive(project);
                }
              }}
              tabIndex={0}
              role="button"
              aria-haspopup="dialog"
              aria-label={`Explore ${project.name}`}
            >
              <span className="card-meta">
                <span className="card-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <motion.span
                  className="card-category"
                  layoutId={sharedId('category', project)}
                >
                  {project.category}
                </motion.span>
                <span className="card-open" aria-hidden="true">
                  <ArrowUpRight size={19} />
                </span>
              </span>
              <div className="card-body">
                <motion.h3 layoutId={sharedId('title', project)}>
                  {project.name}
                </motion.h3>
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
            </motion.div>
          </article>
        ))}
      </div>
      <AnimatePresence>
        {active && (
          <ExpandableProjectDialog
            key={active.name}
            layoutId={`${id}-card-${active.name}`}
            labelledBy={`${id}-project-title`}
            onClose={close}
          >
            <div className="project-dialog-content">
              <div className="project-dialog-top">
                <span className="micro-label">
                  PROJECT /{' '}
                  <motion.span layoutId={sharedId('category', active)}>
                    {active.category}
                  </motion.span>
                </span>
                <button
                  className="dialog-close"
                  onClick={close}
                  aria-label="Close project"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="project-dialog-body">
                <span className="eyebrow">A CLOSER LOOK</span>
                <motion.h2
                  id={`${id}-project-title`}
                  layoutId={sharedId('title', active)}
                >
                  {active.name}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.18,
                    delay: reduceMotion ? 0 : 0.1,
                  }}
                  className="project-dialog-details"
                >
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
                </motion.div>
              </div>
            </div>
          </ExpandableProjectDialog>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
