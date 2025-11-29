import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAttachment extends Document {
  _id: string;
  appId: mongoose.Types.ObjectId;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number; // in bytes
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    appId: {
      type: Schema.Types.ObjectId,
      ref: "App",
      required: true,
    },
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "uploadedAt", updatedAt: false },
  }
);

const Attachment: Model<IAttachment> =
  mongoose.models.Attachment ||
  mongoose.model<IAttachment>("Attachment", AttachmentSchema);

export default Attachment;

