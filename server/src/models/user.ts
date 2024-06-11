import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
});

export default mongoose.model<IUser>('User', UserSchema);