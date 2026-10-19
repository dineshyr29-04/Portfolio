import { ArrowUpRight } from 'lucide-react';
import './Community.css';

const roles = [
  { club: 'NIAT Tech Club', role: 'President' },
  { club: 'Yentech Club', role: 'Web Dev Head' },
  { club: 'AWS Cloud Club', role: 'Tech Relationship Head' },
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
            <span className="eyebrow">05 / HACKATHONS & CLUBS</span>
            <h2 id="community-title">Building with people.</h2>
          </div>
          <p>
            Beyond individual projects.
            <br />
            Teams, clubs, and shared ideas.
          </p>
        </div>
        <div className="community-layout">
          <div className="hackathon-note" data-reveal>
            <span className="micro-label">HACKATHONS</span>
            <h3>
              Ideas into
              <br />
              <span className="serif-word">prototypes.</span>
            </h3>
            <p>
              Building with a team, working through a deadline, and turning an
              idea into something we can demonstrate.
            </p>
            <a className="text-link" href="#work">
              Explore the projects <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="club-roles" data-reveal data-reveal-delay="60">
            <span className="micro-label">CLUB LEADERSHIP</span>
            {roles.map((item, index) => (
              <div className="club-role" key={item.club}>
                <span className="club-index">0{index + 1}</span>
                <div>
                  <h3>{item.club}</h3>
                  <p>{item.role}</p>
                </div>
                <span className="club-marker" aria-hidden="true">
                  +
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
