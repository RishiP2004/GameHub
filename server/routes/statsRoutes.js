import express from 'express';
import { getPlayerWins, updatePlayerWins, getTopPlayers } from '../controllers/statsController.js';
import {checkApiKey} from '../middlewares/checkApiKey.js';

const router = express.Router();

router.get('/player-wins/:username/:game', getPlayerWins);
router.put('/player/:username/updateWins/:game', checkApiKey, updatePlayerWins);
router.get('/top-wins/:game', getTopPlayers);

export default router;
