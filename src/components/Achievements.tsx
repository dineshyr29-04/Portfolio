import { ArrowUpRight } from 'lucide-react';
import './Achievements.css';

const roles = [
  {
    club: 'NIAT Tech Club',
    role: 'President',
    description:
      'Leading technical initiatives, workshops, events, and student developer engagement.',
  },
  {
    club: 'YenTech Club',
    role: 'Web Development Head',
    description:
      'Leading web development activities, website projects, and technical collaboration.',
  },
];
const achievements = [
  {
    title: 'Hackathon winner',
    detail: 'Won a hackathon through technical problem-solving and teamwork.',
  },
  {
    title: 'Two international hackathons',
    detail: 'Selected to participate in two international hackathons.',
  },
  {
    title: 'OpenLoop',
    detail: 'Led website development for a 24-hour national hackathon.',
  },
  {
    title: 'Project Sankalp — Code for Change',
    detail: 'Developed the official website for a 24-hour hackathon.',
  },
  {
    title: 'Replit Vibeathon',
    detail: 'Built a Smart AutoForm AI MVP during a 36-hour hackathon.',
  },
];

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="achievements-section"
      aria-labelledby="achievements-title"
    >
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">03 / ACHIEVEMENTS & LEADERSHIP</span>
            <h2 id="achievements-title">Achievements &amp; leadership.</h2>
          </div>
          <p>
            Beyond individual projects.
            <br />
            Teams, clubs, and shared ideas.
          </p>
        </div>
        <div className="achievements-layout">
          <div className="hackathon-note">
            <h3 className="micro-label" data-reveal>
              HACKATHONS
            </h3>
            <ul className="achievement-list">
              {achievements.map((item, index) => (
                <li
                  key={item.title}
                  data-reveal
                  data-reveal-delay={(index % 3) * 65}
                >
                  <h4>{item.title}</h4>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
            <a className="text-link" href="#work">
              Explore the projects <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="club-roles">
            <h3 className="micro-label" data-reveal>
              CLUB LEADERSHIP
            </h3>
            {roles.map((item, index) => (
              <div
                className="club-role"
                key={item.club}
                data-reveal
                data-reveal-delay={index * 75}
              >
                <span className="club-index">0{index + 1}</span>
                <div>
                  <h4>{item.club}</h4>
                  <p>{item.role}</p>
                  {item.description && (
                    <p className="club-description">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
