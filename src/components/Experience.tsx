import './Experience.css';

export default function Experience() {
  return (
    <section
      id="experience"
      className="career-section page-width"
      aria-labelledby="experience-title"
    >
      <div className="section-heading" data-reveal>
        <div>
          <span className="eyebrow">05 / EXPERIENCE</span>
          <h2 id="experience-title">My experience path.</h2>
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
            <h3>AWS Student Builder Group</h3>
            <p>Technical Lead</p>
          </div>
        </li>
      </ol>
    </section>
  );
}
