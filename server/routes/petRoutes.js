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

router.use(protect);

router.get('/stats', getPetStats);
router.route('/')
    .get(getPets)
    .post(createPet);

router.route('/:id')
    .get(getPet)
    .put(updatePet)
    .delete(deletePet);

export default router;
