import { model, models, Schema, Types, Document } from 'mongoose';

export interface ITagQuestion {
  tag: Types.ObjectId;
  question: Types.ObjectId;
}

export interface ITagQuestionDoc extends ITagQuestion, Document {}
const TagQuestionSchema = new Schema<ITagQuestion>(
  {
    // Use aliases to support legacy field names `tagId` and `questionId`
    tag: {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: true,
      alias: 'tagId',
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      alias: 'questionId',
    },
  },
  { timestamps: true }
);

const TagQuestion =
  models?.TagQuestion || model<ITagQuestion>('TagQuestion', TagQuestionSchema);

export default TagQuestion;
