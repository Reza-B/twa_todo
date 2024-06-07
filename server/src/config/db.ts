import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/task_db", {});
		console.log("MongoDB connected!");
	} catch (error: any) {
		console.error(error.message);
		process.exit(1);
	}
};

export default connectDB;
