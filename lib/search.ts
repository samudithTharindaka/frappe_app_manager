import connectDB from "./mongodb";
import App from "@/models/App";
import Documentation from "@/models/Documentation";

export async function searchApps(query: string) {
  await connectDB();

  try {
    const apps = await App.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { clientName: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    })
      .populate("createdBy", "name email")
      .sort({ updatedAt: -1 })
      .limit(20);

    return apps;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

export async function searchDocs(query: string) {
  await connectDB();

  try {
    const docs = await Documentation.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    })
      .populate("appId", "name clientName")
      .populate("createdBy", "name email")
      .sort({ updatedAt: -1 })
      .limit(20);

    return docs;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

