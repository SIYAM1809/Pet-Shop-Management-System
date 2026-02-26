/**
 * NEXT.JS CONCEPT: Home Page (app/page.js)
 * 
 * In Next.js App Router, every "page.js" file = a route.
 * This file = the "/" route (home page).
 * 
 * This is a SERVER COMPONENT (no "use client" at top).
 * It runs on the server, HTML is pre-built.
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container">
      <div className="hero">
        <h1>🐾 Happy Tails</h1>
        <p>
          A Next.js learning project built on top of the Pet Shop MERN project.
          Each page demonstrates a different Next.js rendering strategy.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/pets" className="btn">View All Pets</Link>
          <Link href="/dashboard" className="btn" style={{ background: '#0891b2' }}>
            Dashboard
          </Link>
        </div>
      </div>

      {/* Learning guide cards */}
      <div className="pets-grid" style={{ marginTop: '3rem' }}>
        <div className="pet-card" style={{ cursor: 'default' }}>
          <div className="pet-image" style={{ fontSize: '3rem', height: '120px' }}>🟢</div>
          <div className="pet-info">
            <p className="pet-name">Pet Listing Page</p>
            <p className="pet-species">/pets route</p>
            <div className="concept-box" style={{ marginTop: '0.75rem' }}>
              <h3>Concept</h3>
              <p>
                Uses <code>SSG</code> — Static Site Generation.
                Data is fetched at <strong>build time</strong> and the
                page is pre-built. Fastest loading strategy.
              </p>
            </div>
          </div>
        </div>

        <div className="pet-card" style={{ cursor: 'default' }}>
          <div className="pet-image" style={{ fontSize: '3rem', height: '120px' }}>🟠</div>
          <div className="pet-info">
            <p className="pet-name">Pet Detail Page</p>
            <p className="pet-species">/pets/[id] route</p>
            <div className="concept-box" style={{ marginTop: '0.75rem' }}>
              <h3>Concept</h3>
              <p>
                Uses <code>Dynamic Routes + SSG</code>.
                Individual pet pages are pre-built using
                <code>generateStaticParams()</code>.
              </p>
            </div>
          </div>
        </div>

        <div className="pet-card" style={{ cursor: 'default' }}>
          <div className="pet-image" style={{ fontSize: '3rem', height: '120px' }}>🔴</div>
          <div className="pet-info">
            <p className="pet-name">Dashboard</p>
            <p className="pet-species">/dashboard route</p>
            <div className="concept-box" style={{ marginTop: '0.75rem' }}>
              <h3>Concept</h3>
              <p>
                Uses <code>SSR</code> — Server-Side Rendering.
                Data is fetched fresh on <strong>every visit</strong>.
                Best for live stats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
