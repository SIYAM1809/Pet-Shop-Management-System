/**
 * NEXT.JS CONCEPT: layout.js
 * 
 * This is the ROOT LAYOUT — it wraps EVERY page in the app.
 * Think of it like App.jsx in React, but more powerful.
 * 
 * - Whatever you put here appears on ALL pages
 * - You can have nested layouts for specific sections
 * - This is a SERVER COMPONENT by default (runs on the server, not browser)
 */

import './globals.css';
import Link from 'next/link';

// Metadata — Next.js uses this for <title> and <meta> tags automatically
// This replaces manually writing <head> tags
export const metadata = {
  title: 'Happy Tails | Next.js Learning Project',
  description: 'Learning Next.js with the Pet Shop project',
};

export default function RootLayout({ children }) {
  /**
   * NEXT.JS CONCEPT: Server Component
   * 
   * This component runs on the SERVER. That means:
   * - No useState, no useEffect (those are browser-only)
   * - Can directly access databases, file system, etc.
   * - The HTML is pre-rendered before being sent to the browser
   * 
   * To make a component run in the browser, add "use client" at the top.
   */
  return (
    <html lang="en">
      <body>
        {/* NAVBAR — appears on every page because it's in the layout */}
        <nav className="navbar">
          {/**
                     * NEXT.JS CONCEPT: <Link> component
                     * 
                     * Use Next.js's <Link> instead of <a> for internal navigation.
                     * - <a> = full page reload (slow, like a normal website)
                     * - <Link> = client-side navigation (instant, like React Router)
                     * 
                     * Next.js also pre-fetches linked pages in the background!
                     */}
          <Link href="/" className="navbar-brand">🐾 Happy Tails</Link>
          <ul className="navbar-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/pets">All Pets</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>

        {/* children = the current page being rendered */}
        <main>{children}</main>
      </body>
    </html>
  );
}
