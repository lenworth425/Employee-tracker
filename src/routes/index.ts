import { Router } from 'express';
const router = Router();

import sqlRoutes from './sqlRoutes.js';


router.use('/routes', sqlRoutes);

export default router;
