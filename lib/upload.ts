import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "text/markdown",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export async function uploadFile(
  file: File
): Promise<{ url: string; filename: string; fileSize: number }> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 10MB limit");
  }

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Allowed types: PDF, Markdown, PNG, JPEG, WEBP"
    );
  }

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  // Check if we're in production (Vercel)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Use Vercel Blob Storage in production
    try {
      const blob = await put(filename, file, {
        access: "public",
      });

      return {
        url: blob.url,
        filename: file.name,
        fileSize: file.size,
      };
    } catch (error: any) {
      console.error("Vercel Blob upload error:", error);
      throw new Error("Failed to upload file to storage");
    }
  } else {
    // Use local file system in development
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Create uploads directory if it doesn't exist
      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);

      return {
        url: `/uploads/${filename}`,
        filename: file.name,
        fileSize: file.size,
      };
    } catch (error: any) {
      console.error("Local file upload error:", error);
      throw new Error("Failed to upload file locally");
    }
  }
}

