import express from 'express';

import controllers from './controllers';

const router = express.Router();

router.route('/').get(controllers.getUsers).post(controllers.createUser);
router.route('/:id').patch(controllers.favoriteCharacters);

export default router;
