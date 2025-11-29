import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IApp extends Document {
  _id: Types.ObjectId;
  name: string;
  clientName: string;
  description: string;
  githubRepoUrl?: string;
  frappeCloudUrl?: string;
  version: string;
  tags: string[];
  status: "Active" | "Deprecated" | "Internal";
  
  // GitHub metadata
  repoName?: string;
  repoOwner?: string;
  stars?: number;
  lastCommit?: Date;
  branches?: string[];
  readme?: string;
  
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AppSchema = new Schema<IApp>(
  {
    name: {
      type: String,
      required: [true, "App name is required"],
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, "Client/Company name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    githubRepoUrl: {
      type: String,
      trim: true,
    },
    frappeCloudUrl: {
      type: String,
      trim: true,
    },
    version: {
      type: String,
      default: "1.0.0",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Active", "Deprecated", "Internal"],
      default: "Active",
    },
    
    // GitHub metadata
    repoName: String,
    repoOwner: String,
    stars: Number,
    lastCommit: Date,
    branches: [String],
    readme: String,
    
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

// Indexes for search
AppSchema.index({ name: "text", description: "text", clientName: "text" });

const App: Model<IApp> =
  mongoose.models.App || mongoose.model<IApp>("App", AppSchema);

export default App;

