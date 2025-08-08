import { Schema, models, model, Types } from 'mongoose';

export interface IModel {}

const ModelSchema = new Schema<IModel>({}, { timestamps: true });

const Model = models?.Model || model<IModel>('IModel', ModelSchema);

export default Model;
