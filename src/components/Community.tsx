import { ArrowUpRight } from 'lucide-react';
import './Community.css';

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

export default function Community() {
  return (
    <section
      id="community"
      className="community-section"
      aria-labelledby="community-title"
    >
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">06 / HACKATHONS & CLUBS</span>
            <h2 id="community-title">Building with people.</h2>
          </div>
          <p>
            Beyond individual projects.
            <br />
            Teams, clubs, and shared ideas.
          </p>
        </div>
        <div className="community-layout">
          <div className="hackathon-note">
            <span className="micro-label">HACKATHONS</span>
            <h3 data-reveal>
              Hackathons &amp;
              <br />
              <span className="serif-word">achievements.</span>
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
            <span className="micro-label">CLUB LEADERSHIP</span>
            {roles.map((item, index) => (
              <div
                className="club-role"
                key={item.club}
                data-reveal
                data-reveal-delay={index * 75}
              >
                <span className="club-index">0{index + 1}</span>
                <div>
                  <h3>{item.club}</h3>
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
