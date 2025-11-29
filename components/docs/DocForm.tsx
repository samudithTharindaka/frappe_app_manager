"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { docSchema } from "@/lib/validations/docSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownViewer } from "./MarkdownViewer";

interface DocFormProps {
  defaultValues?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function DocForm({ defaultValues, onSubmit, isLoading }: DocFormProps) {
  const [preview, setPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(docSchema),
    defaultValues: defaultValues || {
      title: "",
      slug: "",
      content: "",
      order: 0,
      type: "custom",
    },
  });

  const contentValue = watch("content");
  const titleValue = watch("title");

  const onFormSubmit = (data: any) => {
    onSubmit(data);
  };

  const generateSlug = () => {
    if (titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      return slug;
    }
    return "";
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                {...register("slug")}
                placeholder="my-documentation-page"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const slug = generateSlug();
                  if (slug) {
                    (document.getElementById("slug") as HTMLInputElement).value = slug;
                  }
                }}
              >
                Generate
              </Button>
            </div>
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug.message as string}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly version of the title (lowercase, no spaces)
            </p>
          </div>

          <div>
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              {...register("order", { valueAsNumber: true })}
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Display order in the documentation list (lower numbers first)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={preview ? "preview" : "edit"} onValueChange={(v) => setPreview(v === "preview")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <Textarea
                {...register("content")}
                rows={20}
                placeholder="Write your documentation in Markdown..."
                className="font-mono text-sm"
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.content.message as string}
                </p>
              )}
            </TabsContent>

            <TabsContent value="preview">
              <div className="border rounded-lg p-4 min-h-[500px]">
                {contentValue ? (
                  <MarkdownViewer content={contentValue} />
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
          {isLoading ? "Saving..." : "Save Documentation"}
        </Button>
      </div>
    </form>
  );
}

