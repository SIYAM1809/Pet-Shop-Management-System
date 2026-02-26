/**
 * ============================================================
 * NEXT.JS CONCEPT: SSR — Server-Side Rendering
 * ============================================================
 *
 * This page uses SSR. Here's what that means:
 *
 * WHEN does it run?
 *   → On EVERY request, on the server, in real-time
 *   → Every time someone visits /dashboard, this runs fresh
 *
 * HOW do we enable SSR in App Router?
 *   → Add: export const dynamic = 'force-dynamic'
 *   → OR use: cache: 'no-store' in fetch()
 *   → This tells Next.js: "Never cache this, always re-fetch"
 *
 * WHY use SSR for dashboard?
 *   → Dashboard shows live stats (total pets, orders, customers)
 *   → These numbers change frequently
 *   → SSG would show stale data from build time
 *   → SSR guarantees fresh data on every visit
 *
 * TRADE-OFF:
 *   → SSR is slower than SSG (fetches on every request)
 *   → But users always see the latest data
 *   → SSG is faster but might show old data
 *
 * COMPARE to your React Dashboard.jsx:
 *   → Both are "always fresh" — but React fetches in the BROWSER
 *   → SSR fetches on the SERVER, sends complete HTML
 *   → SSR = better performance, better SEO
 * ============================================================
 */

/**
 * NEXT.JS CONCEPT: Route Segment Config
 *
 * This line forces SSR for this entire page/route.
 * Without it, Next.js would try to statically generate the page.
 */
export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Fetch pet statistics from your existing Express backend.
 *
 * We call the SAME /api/pets/stats endpoint that your React
 * dashboard uses — just from the server instead of the browser!
 */
async function fetchStats() {
    try {
        /**
         * cache: 'no-store' = NEVER cache this response
         * This is what makes this SSR — fresh data every request
         *
         * COMPARE the three modes:
         *   'force-cache' → SSG (cached forever)
         *   no-store      → SSR (never cached)
         *   revalidate:60 → ISR (refresh every 60 seconds)
         */
        const [petsRes, ordersRes, customersRes] = await Promise.all([
            fetch(`${API_URL}/pets/stats`, {
                cache: 'no-store',
                headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN || ''}` }
            }),
            fetch(`${API_URL}/orders/stats`, {
                cache: 'no-store',
                headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN || ''}` }
            }),
            fetch(`${API_URL}/customers`, {
                cache: 'no-store',
                headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN || ''}` }
            })
        ]);

        const petsData = petsRes.ok ? await petsRes.json() : null;
        const ordersData = ordersRes.ok ? await ordersRes.json() : null;
        const customersData = customersRes.ok ? await customersRes.json() : null;

        return {
            totalPets: petsData?.data?.total ?? 'N/A',
            availablePets: petsData?.data?.available ?? 'N/A',
            soldPets: petsData?.data?.sold ?? 'N/A',
            bySpecies: petsData?.data?.bySpecies ?? [],
            totalOrders: ordersData?.data?.total ?? 'N/A',
            totalRevenue: ordersData?.data?.totalRevenue ?? 'N/A',
            totalCustomers: customersData?.count ?? 'N/A',
        };
    } catch {
        return null;
    }
}

export default async function DashboardPage() {
    /**
     * NEXT.JS CONCEPT: Server-side async data fetching
     *
     * No useEffect. No useState. No loading spinner.
     * The await here runs on the SERVER.
     * The component only renders AFTER this data is ready.
     *
     * User receives complete, data-filled HTML — not an empty shell.
     */
    const stats = await fetchStats();
    const fetchedAt = new Date().toLocaleTimeString('en-US');

    const statCards = stats ? [
        { label: 'Total Pets', value: stats.totalPets, emoji: '🐾' },
        { label: 'Available Pets', value: stats.availablePets, emoji: '✅' },
        { label: 'Pets Sold', value: stats.soldPets, emoji: '🏷️' },
        { label: 'Total Customers', value: stats.totalCustomers, emoji: '👥' },
        { label: 'Total Orders', value: stats.totalOrders, emoji: '📦' },
        {
            label: 'Total Revenue',
            value: typeof stats.totalRevenue === 'number'
                ? `$${stats.totalRevenue.toLocaleString()}`
                : stats.totalRevenue,
            emoji: '💰'
        },
    ] : [];

    return (
        <div className="container">
            {/* Rendering Strategy Badge */}
            <span className="render-badge badge-ssr">
                🟠 SSR — Server-Side Rendering
            </span>

            <div className="page-header">
                <h1>Dashboard</h1>
                <p>
                    This page is rendered fresh on the server on every visit.
                    Data fetched at: <strong>{fetchedAt}</strong>
                    &nbsp;(refresh to see it update!)
                </p>
            </div>

            {/* Learning concept box */}
            <div className="concept-box">
                <h3>📚 What's happening here</h3>
                <p>
                    In your React app, <code>Dashboard.jsx</code> uses{' '}
                    <code>useEffect</code> to fetch data AFTER the page loads
                    in the browser. Here, Next.js fetches data on the{' '}
                    <strong>server</strong> for every visit using{' '}
                    <code>cache: 'no-store'</code> and{' '}
                    <code>export const dynamic = 'force-dynamic'</code>.
                    The timestamp above changes on every refresh — proving
                    it's truly server-side rendered fresh every time.
                </p>
            </div>

            {!stats ? (
                <div className="error-box">
                    <h2>⚠️ Could not load dashboard stats</h2>
                    <p style={{ marginTop: '0.5rem' }}>
                        Some stats require admin authentication.
                        Make sure your backend is running on port 5001.
                    </p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>
                        Run: <code>cd server && npm run dev</code>
                    </p>
                </div>
            ) : (
                <div className="stats-grid">
                    {statCards.map((card) => (
                        <div key={card.label} className="stat-card">
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                {card.emoji}
                            </div>
                            <div className="stat-value">{card.value}</div>
                            <div className="stat-label">{card.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* SSR vs SSG Comparison */}
            <div style={{ marginTop: '3rem' }}>
                <div className="concept-box">
                    <h3>🔁 SSR vs SSG — Side by Side</h3>
                    <p>
                        <strong>Pets page (/pets)</strong> uses SSG:{' '}
                        built once, loads instantly, data may be slightly old.<br />
                        <strong>This dashboard</strong> uses SSR:{' '}
                        fetched fresh every visit, always accurate, slightly slower.<br /><br />
                        In production, you'd choose based on how often the data changes.
                        If your pet list doesn't change for hours, SSG is better.
                        If stats update every minute, SSR or ISR (revalidate) is better.
                    </p>
                </div>

                {/* Species breakdown */}
                {stats?.bySpecies?.length > 0 && (
                    <div className="concept-box" style={{ borderLeftColor: '#06b6d4' }}>
                        <h3>🐾 Pets by Species</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                            {stats.bySpecies.map((s) => (
                                <div key={s._id} style={{
                                    background: '#0f0f1a', padding: '0.5rem 1rem',
                                    borderRadius: '8px', textAlign: 'center'
                                }}>
                                    <div style={{ fontWeight: 700, color: '#8b5cf6' }}>{s.count}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s._id}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
