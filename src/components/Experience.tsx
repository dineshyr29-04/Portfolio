import './Experience.css';

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
        <li className="career-entry" data-reveal>
          <div className="career-period">
            <span>
              <time dateTime="2026">2026</time> — Present
            </span>
            <span className="career-status">Current</span>
          </div>
          <div className="career-role">
            <RoleHeading>AWS Student Builder Group</RoleHeading>
            <p>Technical Lead</p>
          </div>
        </li>
      </ol>
    </Container>
  );
}
