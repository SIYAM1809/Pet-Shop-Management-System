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

router.get('/stats', protect, getPetStats);

// Public Routes
router.route('/')
    .get(getPets)
    .post(protect, createPet);

router.route('/:id')
    .get(getPet)
    .put(protect, updatePet)
    .delete(protect, deletePet);

export default router;
