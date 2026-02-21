import express from 'express';
import {
    getPets,
    getPet,
    createPet,
    updatePet,
    deletePet,
    getPetStats
} from '../controllers/petController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/pets/stats:
 *   get:
 *     summary: Get pet statistics
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pet statistics (total, available, sold, by species)
 */
router.get('/stats', protect, getPetStats);

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Get all pets (public)
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Filter by species (Dog, Cat, Bird, etc.)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, sold, reserved]
 *         description: Filter by availability
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results (0 = all)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g. -createdAt for newest first)
 *     responses:
 *       200:
 *         description: List of pets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *   post:
 *     summary: Add a new pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetInput'
 *     responses:
 *       201:
 *         description: Pet created
 *       401:
 *         description: Unauthorized
 */
router.route('/')
    .get(getPets)
    .post(protect, createPet);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Get a single pet by ID (public)
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet MongoDB ID
 *     responses:
 *       200:
 *         description: Pet details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Pet not found
 *   put:
 *     summary: Update a pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetInput'
 *     responses:
 *       200:
 *         description: Pet updated
 *       404:
 *         description: Pet not found
 *   delete:
 *     summary: Delete a pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pet deleted
 *       404:
 *         description: Pet not found
 */
router.route('/:id')
    .get(getPet)
    .put(protect, updatePet)
    .delete(protect, deletePet);

export default router;
