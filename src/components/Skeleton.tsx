import React from 'react';
import './Skeleton.css';

const Skeleton = ({ className = '', type = 'rect' }: { className?: string; type?: 'rect' | 'circle' | 'text' }) => {
  return (
    <div className={`skeleton-item ${type} ${className}`} />
  );
};

export const PortfolioSkeleton = () => {
  return (
    <div className="skeleton-container">
      {/* Navbar Skeleton */}
      <nav className="skeleton-nav">
        <div className="skeleton-nav-content wrap">
          <Skeleton className="skeleton-logo" />
          <div className="skeleton-nav-links">
            <Skeleton className="skeleton-nav-item" />
            <Skeleton className="skeleton-nav-item" />
            <Skeleton className="skeleton-nav-item" />
            <Skeleton className="skeleton-nav-item" />
          </div>
          <Skeleton className="skeleton-badge" />
        </div>
      </nav>

      {/* Hero Skeleton */}
      <section className="skeleton-hero wrap">
        <div className="skeleton-hero-left">
          <Skeleton className="skeleton-title" />
          <Skeleton className="skeleton-subtitle" />
          <div className="skeleton-hero-btns">
            <Skeleton className="skeleton-btn" />
            <Skeleton className="skeleton-btn" />
          </div>
        </div>
        <div className="skeleton-hero-right">
          <Skeleton className="skeleton-editor" />
        </div>
      </section>

      {/* About Skeleton */}
      <section className="skeleton-about wrap">
        <Skeleton className="skeleton-section-title" />
        <div className="skeleton-about-grid">
          <Skeleton className="skeleton-about-text" />
          <Skeleton className="skeleton-about-image" />
        </div>
      </section>

      {/* Skills Skeleton */}
      <section className="skeleton-skills wrap">
        <Skeleton className="skeleton-section-title" />
        <div className="skeleton-skills-grid">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="skeleton-skill-card" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Skeleton;
