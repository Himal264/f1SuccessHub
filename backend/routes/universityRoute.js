import express from 'express';
import { getUniversityMatches } from '../controllers/UniversityMatch.js';

const MatchRouter = express.Router();
MatchRouter.post('/match', getUniversityMatches);

export default MatchRouter;