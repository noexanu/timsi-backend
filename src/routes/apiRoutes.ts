import { Router } from 'express';
import ApiController from 'controllers/apiController';

const router = Router();

router.get('/data', ApiController.data);

export default router;
