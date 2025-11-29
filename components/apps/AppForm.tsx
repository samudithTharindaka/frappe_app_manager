"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appSchema } from "@/lib/validations/appSchema";
import { useFetchGitHub } from "@/hooks/useGitHub";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AppFormProps {
  defaultValues?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function AppForm({ defaultValues, onSubmit, isLoading }: AppFormProps) {
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const fetchGitHub = useFetchGitHub();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appSchema),
    defaultValues: defaultValues || {
      name: "",
      clientName: "",
      description: "",
      githubRepoUrl: "",
      frappeCloudUrl: "",
      version: "1.0.0",
      status: "Active",
    },
  });

  const githubRepoUrl = watch("githubRepoUrl");

  const handleFetchGitHub = async () => {
    if (!githubRepoUrl) return;

    console.log("🔍 Fetching GitHub data for:", githubRepoUrl);
    const data = await fetchGitHub.mutateAsync(githubRepoUrl);
    
    console.log("📥 GitHub data received in AppForm:", {
      repoName: data?.repoName,
      repoOwner: data?.repoOwner,
      stars: data?.stars,
      hasReadme: !!data?.readme,
      readmeLength: data?.readme?.length || 0,
      readmePreview: data?.readme?.substring(0, 100),
    });
    
    if (data) {
      // Auto-populate form fields
      if (data.repoName && !watch("name")) {
        setValue("name", data.repoName);
      }
      if (data.description && !watch("description")) {
        setValue("description", data.description);
      }
      
      // Store GitHub metadata in form (will be saved to app model)
      // Note: These fields are part of the app model but not in the form
      // They will be added by the onSubmit handler
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()];
        setTags(newTags);
        setValue("tags", newTags);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const onFormSubmit = async (data: any) => {
    // If we have a GitHub URL, fetch the metadata before submitting
    let githubMetadata = {};
    
    if (data.githubRepoUrl && data.githubRepoUrl !== defaultValues?.githubRepoUrl) {
      try {
        console.log("📤 Fetching GitHub metadata before submit:", data.githubRepoUrl);
        const metadata = await fetchGitHub.mutateAsync(data.githubRepoUrl);
        githubMetadata = {
          repoName: metadata.repoName,
          repoOwner: metadata.repoOwner,
          stars: metadata.stars,
          lastCommit: metadata.lastCommit,
          branches: metadata.branches,
          readme: metadata.readme,
        };
        console.log("✅ GitHub metadata to be saved:", {
          ...githubMetadata,
          readme: githubMetadata.readme ? `${githubMetadata.readme.length} chars` : 'none',
        });
      } catch (error) {
        console.error("❌ Failed to fetch GitHub metadata:", error);
        // Continue with form submission even if GitHub fetch fails
      }
    }
    
    const finalData = { ...data, tags, ...githubMetadata };
    console.log("💾 Submitting app data:", {
      ...finalData,
      readme: finalData.readme ? `${finalData.readme.length} chars` : 'none',
    });
    
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">App Name *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="clientName">Client/Company Name *</Label>
            <Input id="clientName" {...register("clientName")} />
            {errors.clientName && (
              <p className="text-sm text-red-600 mt-1">{errors.clientName.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} rows={4} />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message as string}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="version">Version</Label>
              <Input id="version" {...register("version")} placeholder="1.0.0" />
              {errors.version && (
                <p className="text-sm text-red-600 mt-1">{errors.version.message as string}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={defaultValues?.status || "Active"}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Deprecated">Deprecated</SelectItem>
                  <SelectItem value="Internal">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links & Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="githubRepoUrl">GitHub Repository URL</Label>
            <div className="flex gap-2">
              <Input
                id="githubRepoUrl"
                {...register("githubRepoUrl")}
                placeholder="https://github.com/username/repo"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleFetchGitHub}
                disabled={!githubRepoUrl || fetchGitHub.isPending}
              >
                {fetchGitHub.isPending ? "Fetching..." : "Fetch Data"}
              </Button>
            </div>
            {errors.githubRepoUrl && (
              <p className="text-sm text-red-600 mt-1">
                {errors.githubRepoUrl.message as string}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="frappeCloudUrl">Frappe Cloud Install URL</Label>
            <Input
              id="frappeCloudUrl"
              {...register("frappeCloudUrl")}
              placeholder="https://frappecloud.com/..."
            />
            {errors.frappeCloudUrl && (
              <p className="text-sm text-red-600 mt-1">
                {errors.frappeCloudUrl.message as string}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tags">Add Tags (Press Enter to add)</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="e.g., accounting, inventory"
            />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save App"}
        </Button>
      </div>
    </form>
  );
}

