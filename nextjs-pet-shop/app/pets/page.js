/**
 * ============================================================
 * NEXT.JS CONCEPT: SSG — Static Site Generation
 * ============================================================
 *
 * This page uses SSG. Here's what that means:
 *
 * WHEN does it run?
 *   → At BUILD TIME (when you run `npm run build`)
 *   → NOT when a user visits the page
 *
 * HOW does it work?
 *   → Next.js runs this file on the server ONCE during build
 *   → Fetches all pets from your existing Express backend
 *   → Builds a complete HTML file with the data already inside
 *   → Serves that pre-built HTML to EVERY user instantly
 *
 * WHY use it for pets?
 *   → Pet listings don't change every second
 *   → Pre-built pages load INSTANTLY (no waiting for data)
 *   → Great for SEO — Google sees the full content
 *
 * COMPARE to your React app:
 *   → In React (BrowsePets.jsx): useEffect fetches AFTER page loads
 *   → In Next.js SSG: data is IN the HTML before the page even opens
 *
 * In App Router, any async Server Component automatically does SSG
 * unless you change the cache behavior (you'll see that in dashboard).
 * ============================================================
 */

import Link from 'next/link';

// Helper: get emoji for pet species
function getPetEmoji(species) {
    const emojis = {
        Dog: '🐕', Cat: '🐈', Bird: '🦜',
        Fish: '🐠', Rabbit: '🐇', Hamster: '🐹',
        Reptile: '🦎', Other: '🐾'
    };
    return emojis[species] || '🐾';
}

/**
 * NEXT.JS CONCEPT: async Server Component
 *
 * In React you'd write:
 *   const [pets, setPets] = useState([]);
 *   useEffect(() => { fetch(...).then(r => r.json()).then(setPets) }, []);
 *
 * In Next.js Server Components, you can use async/await DIRECTLY:
 *   const pets = await fetch(...).then(r => r.json());
 *
 * No useState. No useEffect. No loading spinner needed.
 * The data is ready BEFORE the component renders.
 */
export default async function PetsPage() {

    // ─── DATA FETCHING ───────────────────────────────────────
    /**
     * NEXT.JS CONCEPT: fetch() with cache options
     *
     * Next.js EXTENDS the native fetch() with caching options:
     *
     *   cache: 'force-cache'    → SSG (default) — cached at build time
     *   cache: 'no-store'       → SSR — fresh on every request
     *   next: { revalidate: 60 } → ISR — refresh every 60 seconds
     *
     * We use 'force-cache' here = SSG behavior.
     */
    let pets = [];
    let error = null;

    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        const response = await fetch(`${API_URL}/pets?limit=12`, {
            cache: 'force-cache',   // ← SSG: cache this response at build time
        });

        if (!response.ok) throw new Error('Failed to fetch pets');

        const data = await response.json();
        pets = data.data || [];
    } catch (err) {
        error = err.message;
    }

    // ─── ERROR STATE ──────────────────────────────────────────
    if (error) {
        return (
            <div className="container">
                <div className="error-box">
                    <h2>⚠️ Could not load pets</h2>
                    <p style={{ marginTop: '0.5rem' }}>
                        Make sure your backend server is running on port 5001.
                    </p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>
                        Run: <code>cd server && npm run dev</code>
                    </p>
                </div>
            </div>
        );
    }

    // ─── RENDER ───────────────────────────────────────────────
    return (
        <div className="container">
            {/* Rendering Strategy Badge */}
            <span className="render-badge badge-ssg">
                🟢 SSG — Static Site Generation
            </span>

            <div className="page-header">
                <h1>All Pets</h1>
                <p>
                    This page was pre-built at build time using SSG.
                    Data was fetched once and baked into the HTML.
                </p>
            </div>

            {/* Learning note */}
            <div className="concept-box">
                <h3>📚 What's happening here</h3>
                <p>
                    In your React app, <code>BrowsePets.jsx</code> uses{' '}
                    <code>useEffect</code> to fetch pets AFTER the page loads —
                    users briefly see a loading spinner. Here, Next.js fetched the
                    data on the server at build time. When you open this page, the
                    pets are already in the HTML — no spinner, no waiting.
                </p>
            </div>

            {pets.length === 0 ? (
                <div className="not-found">
                    <h2>No pets found</h2>
                    <p>Make sure your backend is running and has data seeded.</p>
                </div>
            ) : (
                <div className="pets-grid">
                    {pets.map((pet) => (
                        /**
                         * NEXT.JS CONCEPT: Dynamic Route linking
                         *
                         * Clicking a pet links to /pets/[id]
                         * Next.js will pre-build those pages too (see pets/[id]/page.js)
                         */
                        <Link
                            key={pet._id}
                            href={`/pets/${pet._id}`}
                            className="pet-card"
                        >
                            <div className="pet-image">
                                {getPetEmoji(pet.species)}
                            </div>
                            <div className="pet-info">
                                <p className="pet-name">{pet.name}</p>
                                <p className="pet-species">
                                    {pet.species} · {pet.breed}
                                </p>
                                <p className="pet-price">${pet.price}</p>
                                <span className={`pet-status status-${pet.status?.toLowerCase()}`}>
                                    {pet.status}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
