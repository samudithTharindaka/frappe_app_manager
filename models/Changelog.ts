import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IChangelog extends Document {
  _id: Types.ObjectId;
  appId: mongoose.Types.ObjectId;
  version: string;
  changes: string; // Markdown content
  releaseDate: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChangelogSchema = new Schema<IChangelog>(
  {
    appId: {
      type: Schema.Types.ObjectId,
      ref: "App",
      required: true,
    },
    version: {
      type: String,
      required: [true, "Version is required"],
      trim: true,
    },
    changes: {
      type: String,
      required: [true, "Changes description is required"],
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Sort by release date descending
ChangelogSchema.index({ appId: 1, releaseDate: -1 });

const Changelog: Model<IChangelog> =
  mongoose.models.Changelog ||
  mongoose.model<IChangelog>("Changelog", ChangelogSchema);

export default Changelog;

