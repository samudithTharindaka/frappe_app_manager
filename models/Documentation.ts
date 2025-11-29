import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDocumentation extends Document {
  _id: Types.ObjectId;
  appId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string; // Markdown content
  order: number;
  type: "readme" | "changelog" | "custom";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentationSchema = new Schema<IDocumentation>(
  {
    appId: {
      type: Schema.Types.ObjectId,
      ref: "App",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    order: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ["readme", "changelog", "custom"],
      default: "custom",
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

// Unique slug per app
DocumentationSchema.index({ appId: 1, slug: 1 }, { unique: true });

// Text index for search
DocumentationSchema.index({ title: "text", content: "text" });

const Documentation: Model<IDocumentation> =
  mongoose.models.Documentation ||
  mongoose.model<IDocumentation>("Documentation", DocumentationSchema);

export default Documentation;

