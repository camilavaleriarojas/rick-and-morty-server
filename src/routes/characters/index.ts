import express from 'express';

import controllers from '../characters/controllers';

const router = express.Router();

router.route('/').get(controllers.getCharacters);

export default router;
