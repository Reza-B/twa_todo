import express, { Request, Response, NextFunction } from "express";
import connectDB from "./config/db";
import taskRoutes from "./routes/tasks";
import userRoutes from './routes/users'

connectDB();

const app = express();
const port = 3000;

//? Init Middleware
app.use(express.json());

// //? Define Routes
app.use("/api/tasks", taskRoutes);
app.use('/api/user', userRoutes);

// //? Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(error.stack);
	res.status(500).send("Something went wrong");
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
