/**
 * ============================================================
 * NEXT.JS CONCEPT: Dynamic Routes + SSG
 * ============================================================
 *
 * FILE NAME: app/pets/[id]/page.js
 *
 * The [id] brackets = a DYNAMIC segment.
 * This one file handles ALL of these routes:
 *   /pets/64b3f2a1c9e77b001f3e2d45
 *   /pets/64b3f2a1c9e77b001f3e2d46
 *   /pets/64b3f2a1c9e77b001f3e2d47
 *   ... (one per pet in the database)
 *
 * COMPARE to your Express backend:
 *   router.get('/api/pets/:id', ...)  ← Express dynamic route
 *   app/pets/[id]/page.js            ← Next.js dynamic route
 *   Same concept, different side!
 *
 * COMPARE to your React app:
 *   In React Router: <Route path="/pets/:id" element={<PetDetail />} />
 *   In Next.js: just name the folder [id] — routing is automatic!
 * ============================================================
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

function getPetEmoji(species) {
    const emojis = {
        Dog: '🐕', Cat: '🐈', Bird: '🦜',
        Fish: '🐠', Rabbit: '🐇', Hamster: '🐹',
        Reptile: '🦎', Other: '🐾'
    };
    return emojis[species] || '🐾';
}

/**
 * ============================================================
 * NEXT.JS CONCEPT: generateStaticParams()
 * ============================================================
 *
 * PROBLEM: We have dynamic routes like /pets/[id].
 * Next.js doesn't know which IDs exist in the database at build time.
 *
 * SOLUTION: generateStaticParams() tells Next.js:
 *   "Hey, here are ALL the possible IDs. Pre-build a page for each one."
 *
 * Next.js calls this function ONCE at build time, gets the list,
 * then pre-builds /pets/64b3f... /pets/64b4f... etc.
 *
 * COMPARE to your Express backend:
 *   This is like your GET /api/pets endpoint — fetches all pets
 *   so we can get all their IDs to tell Next.js what to pre-build.
 *
 * Without this function, Next.js would render the page on-demand
 * (like SSR) instead of pre-building it (SSG).
 * ============================================================
 */
export async function generateStaticParams() {
    try {
        const response = await fetch(`${API_URL}/pets?limit=50`);
        const data = await response.json();
        const pets = data.data || [];

        // Return an array of { id: "..." } objects — one per pet
        // Next.js will pre-build /pets/[each id] at build time
        return pets.map((pet) => ({
            id: pet._id.toString()
        }));
    } catch {
        // If backend is down during build, return empty (render on-demand)
        return [];
    }
}

/**
 * NEXT.JS CONCEPT: Dynamic Metadata
 *
 * generateMetadata() runs on the server and sets the <title>
 * for each individual pet page dynamically.
 *
 * In React, you'd use a library like react-helmet for this.
 * In Next.js, it's built-in.
 */
export async function generateMetadata({ params }) {
    try {
        const { id } = await params;
        const response = await fetch(`${API_URL}/pets/${id}`);
        const data = await response.json();
        return {
            title: `${data.data?.name} | Happy Tails`,
            description: `${data.data?.species} - ${data.data?.breed} for $${data.data?.price}`
        };
    } catch {
        return { title: 'Pet Details | Happy Tails' };
    }
}

/**
 * The Page Component
 *
 * params.id = the [id] from the URL
 * e.g. visiting /pets/64b3f... → params = { id: "64b3f..." }
 *
 * COMPARE to your Express controller:
 *   req.params.id  ← Express
 *   params.id      ← Next.js (same idea, same name!)
 */
export default async function PetDetailPage({ params }) {
    const { id } = await params;

    let pet = null;
    let error = null;

    try {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            cache: 'force-cache', // ← SSG: pre-built at build time per pet
        });

        if (!response.ok) {
            /**
             * NEXT.JS CONCEPT: notFound()
             *
             * Calling notFound() displays the 404 page (not-found.js).
             * This is the Next.js way to handle "resource not found".
             * Similar to res.status(404).json({...}) in your Express controllers!
             */
            if (response.status === 404) notFound();
            throw new Error('Failed to fetch pet');
        }

        const data = await response.json();
        pet = data.data;
    } catch (err) {
        error = err.message;
    }

    if (error) {
        return (
            <div className="container">
                <div className="error-box">
                    <h2>⚠️ Could not load pet</h2>
                    <p>Make sure your backend is running on port 5001.</p>
                </div>
            </div>
        );
    }

    if (!pet) notFound();

    return (
        <div className="container">
            {/* Rendering Strategy Badge */}
            <span className="render-badge badge-ssg">
                🟢 SSG — Dynamic Route, Pre-built Page
            </span>

            {/* Back navigation */}
            <Link href="/pets" className="back-link">
                ← Back to All Pets
            </Link>

            {/* Concept box */}
            <div className="concept-box">
                <h3>📚 What's happening here</h3>
                <p>
                    This page is at <code>/pets/{'{id}'}</code> — a dynamic route.
                    The folder name <code>[id]</code> makes it dynamic.
                    <code>generateStaticParams()</code> told Next.js to pre-build
                    one page for each pet ID. This page was built at build time,
                    served instantly — no API call needed when you opened it.
                </p>
            </div>

            {/* Pet Detail Card */}
            <div className="pet-detail">
                <div className="pet-detail-header">
                    <div className="pet-detail-image">
                        {getPetEmoji(pet.species)}
                    </div>
                    <div className="pet-detail-info">
                        <h1 className="pet-detail-name">{pet.name}</h1>
                        <p className="pet-detail-price">${pet.price}</p>
                        <span className={`pet-status status-${pet.status?.toLowerCase()}`}
                            style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                            {pet.status}
                        </span>
                        <div className="pet-detail-meta" style={{ marginTop: '1.25rem' }}>
                            <span><strong>Species:</strong> {pet.species}</span>
                            <span><strong>Breed:</strong> {pet.breed}</span>
                            <span><strong>Gender:</strong> {pet.gender}</span>
                            <span><strong>Age:</strong> {pet.age?.value} {pet.age?.unit}</span>
                            {pet.color && <span><strong>Color:</strong> {pet.color}</span>}
                            {pet.weight && <span><strong>Weight:</strong> {pet.weight} kg</span>}
                        </div>
                    </div>
                </div>

                {/* Health Info */}
                {pet.health && (
                    <div className="concept-box" style={{ borderLeftColor: '#10b981' }}>
                        <h3>🏥 Health Status</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                            <span>💉 Vaccinated: <strong>{pet.health.vaccinated ? '✅' : '❌'}</strong></span>
                            <span>✂️ Neutered: <strong>{pet.health.neutered ? '✅' : '❌'}</strong></span>
                            <span>📡 Microchipped: <strong>{pet.health.microchipped ? '✅' : '❌'}</strong></span>
                        </div>
                    </div>
                )}

                {/* Description */}
                {pet.description && (
                    <div className="concept-box" style={{ borderLeftColor: '#06b6d4' }}>
                        <h3>📝 Description</h3>
                        <p>{pet.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
