import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import Task, { ITask } from "../models/task";
import User, { IUser } from "../models/user";

//* Router initialization
const router = Router();

//* Task validation
const taskValidationRules = [
	body("title").notEmpty().withMessage("عنوان اجباری میباشد."),
	body("description").notEmpty().withMessage("توضیحات اجباری میباشد."),
	body("completed").isBoolean().withMessage("Completed must be a boolean"),
];

//* RESTful request handling

////////////////////////////////////////////////////////////////
//? GET - Get all tasks
router.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({ user: req.params.userId });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

////////////////////////////////////////////////////////////////
//? GET - Get one task
router.get("/:id", async (req: Request, res: Response) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(404).send("Task not found");
		}
		res.json(task);
	} catch (error: any) {
		console.log(error);
		res.status(500).send(error);
	}
});

////////////////////////////////////////////////////////////////
//? POST - Create a task
router.post('/', taskValidationRules, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, completed, userId } = req.body;

    try {
        const user: IUser | null = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const newTask: ITask = new Task({
            title,
            description,
            completed,
            user: user._id,
        });

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

////////////////////////////////////////////////////////////////
//? PUT - Update a task
router.put("/:id", taskValidationRules, async (req: Request, res: Response) => {
	const errors = validationResult(req.body);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { title, description, completed } = req.body;

	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(404).send("Task not found");
		}

		task.title = title || task.title;
		task.description = description || task.description;
		task.completed = completed !== undefined ? completed : task.completed;

		await task.save();
		res.json(task);
	} catch (error: any) {
		res.status(500).send("Server Error");
	}
});

////////////////////////////////////////////////////////////////
//? PUT - change completed status
router.put("/toggle/:id", async (req: Request, res: Response) => {
	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(404).send("Task not found");
		}

		task.completed = !task.completed;

		await task.save();
		res.json(task);
	} catch (err) {
		res.status(500).send("Server Error");
	}
});

////////////////////////////////////////////////////////////////
//? DELETE - Delete a task
router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(404).send("Task not found");
		}

		await task.deleteOne();
		res.status(204).send();
	} catch (error: any) {
		res.status(500).send("Server Error");
	}
});

export default router;
