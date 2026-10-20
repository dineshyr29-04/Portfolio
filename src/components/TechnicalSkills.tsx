import './TechnicalSkills.css';
import { languages, toolsets } from '../data/portfolioData';

export default function TechnicalSkills() {
  return (
    <section
      id="skills"
      className="skills-section page-width"
      aria-labelledby="skills-title"
    >
      <div className="section-heading" data-reveal>
        <div>
          <span className="eyebrow">02 / TECHNICAL SKILLS</span>
          <h2 id="skills-title">The tools behind the work.</h2>
        </div>
        <p>
          Languages I write.
          <br />
          Tools I build with.
        </p>
      </div>
      <div className="languages-header" data-reveal>
        <span className="micro-label">LANGUAGES</span>
        <span className="micro-label">FROM SYSTEMS TO APPLICATIONS</span>
      </div>
      <div className="language-grid">
        {languages.map((language, index) => (
          <div
            className="language-item"
            key={language.name}
            data-reveal
            data-reveal-delay={(index % 3) * 50}
          >
            <span className="language-index">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{language.name}</h3>
            <p>{language.context}</p>
          </div>
        ))}
      </div>
      <div className="toolset-grid">
        {toolsets.map((group, index) => (
          <div
            className="toolset"
            key={group.title}
            data-reveal
            data-reveal-delay={index * 60}
          >
            <span className="micro-label">{group.note}</span>
            <h3>{group.title}</h3>
            <ul aria-label={group.title}>
              {group.tools.map(tool => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
