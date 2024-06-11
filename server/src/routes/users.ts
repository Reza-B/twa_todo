import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User, { IUser } from '../models/user';

const router = Router();

const userValidationRules = [
    body('username').notEmpty().withMessage('Username is required.'),
];

// Get or create user by username
router.post('/:username', userValidationRules, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.params;

    try {
        let user: IUser | null = await User.findOne({ username });

        if (!user) {
            const newUser: IUser = new User({ username });
            user = await newUser.save();
            res.status(201).json(user);
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;
