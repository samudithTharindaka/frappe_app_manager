"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changelogSchema } from "@/lib/validations/changelogSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownViewer } from "@/components/docs/MarkdownViewer";

interface ChangelogFormProps {
  defaultValues?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function ChangelogForm({ defaultValues, onSubmit, isLoading }: ChangelogFormProps) {
  const [preview, setPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changelogSchema),
    defaultValues: defaultValues || {
      version: "",
      changes: "",
      releaseDate: new Date().toISOString().split("T")[0],
    },
  });

  const changesValue = watch("changes");

  const onFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Version Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="version">Version *</Label>
              <Input
                id="version"
                {...register("version")}
                placeholder="1.0.0"
              />
              {errors.version && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.version.message as string}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                id="releaseDate"
                type="date"
                {...register("releaseDate")}
              />
              {errors.releaseDate && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.releaseDate.message as string}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={preview ? "preview" : "edit"}
            onValueChange={(v) => setPreview(v === "preview")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <Textarea
                {...register("changes")}
                rows={15}
                placeholder="Describe changes in Markdown format...

Example:
## Added
- New feature X
- New feature Y

## Fixed
- Bug fix Z

## Changed
- Updated component A"
                className="font-mono text-sm"
              />
              {errors.changes && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.changes.message as string}
                </p>
              )}
            </TabsContent>

            <TabsContent value="preview">
              <div className="border rounded-lg p-4 min-h-[400px]">
                {changesValue ? (
                  <MarkdownViewer content={changesValue} />
                ) : (
                  <p className="text-gray-500">Nothing to preview yet...</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changelog"}
        </Button>
      </div>
    </form>
  );
}

