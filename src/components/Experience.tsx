import './Experience.css';
import { experiences } from '../data/portfolioData';

export default function Experience({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const Container = embedded ? 'div' : 'section';
  const Heading = embedded ? 'h3' : 'h2';
  const RoleHeading = embedded ? 'h4' : 'h3';
  return (
    <Container
      id="experience"
      className={`career-section ${embedded ? 'career-section--embedded' : 'page-width'}`}
      aria-labelledby="experience-title"
    >
      <div className="section-heading" data-reveal>
        <div>
          <span className="eyebrow">EXPERIENCE</span>
          <Heading id="experience-title">My experience path.</Heading>
        </div>
      </div>
      <ol className="career-timeline" aria-label="Experience timeline">
        {experiences.map((entry, index) => (
          <li className="career-entry" key={index} data-reveal>
            <div className="career-period">
              <span>{entry.period}</span>
              {entry.status && <span className="career-status">{entry.status}</span>}
            </div>
            <div className="career-role">
              <RoleHeading>{entry.organization}</RoleHeading>
              <p>{entry.role}</p>
            </div>
          </li>
        ))}
      </ol>
    </Container>
  );
}
