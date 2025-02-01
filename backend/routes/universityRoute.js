import express from 'express';
import { getUniversityMatches, getMatchesBySearchProfile } from '../controllers/UniversityMatch.js';

const MatchRouter = express.Router();

MatchRouter.post('/', getUniversityMatches);
MatchRouter.get('/:searchProfileId', getMatchesBySearchProfile);

export default MatchRouter;