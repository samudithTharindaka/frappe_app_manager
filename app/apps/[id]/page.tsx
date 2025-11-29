"use client";

import { use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useApp } from "@/hooks/useApp";
import { useDocs } from "@/hooks/useDocs";
import { useChangelog } from "@/hooks/useChangelog";
import { useAttachments } from "@/hooks/useAttachments";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MarkdownViewer } from "@/components/docs/MarkdownViewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PageSkeleton } from "@/components/common/LoadingSkeleton";
import { format } from "date-fns";

export default function AppDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { data: app, isLoading: appLoading } = useApp(id);
  const { data: docs } = useDocs(id);
  const { data: changelogs } = useChangelog(id);
  const { data: attachments } = useAttachments(id);

  const userRole = (session?.user as any)?.role;
  const canEdit = ["Admin", "Dev"].includes(userRole);

  if (appLoading) {
    return (
      <DashboardLayout>
        <PageSkeleton />
      </DashboardLayout>
    );
  }

  if (!app) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">App not found</h2>
          <Button asChild className="mt-4">
            <Link href="/apps">Back to Apps</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{app.name}</h1>
            <p className="text-gray-600 mt-1">{app.clientName}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant={app.status === "Active" ? "default" : "secondary"}>
                {app.status}
              </Badge>
              <Badge variant="outline">v{app.version}</Badge>
            </div>
          </div>
          {canEdit && (
            <Button asChild>
              <Link href={`/apps/${id}/edit`}>Edit App</Link>
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="readme">README</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            {canEdit && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>App Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{app.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Version</h3>
                    <p className="mt-1">{app.version}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="mt-1">{app.status}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="mt-1">{format(new Date(app.createdAt), "PPP")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="mt-1">{format(new Date(app.updatedAt), "PPP")}</p>
                  </div>
                </div>

                {app.githubRepoUrl && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">GitHub Repository</h3>
                      <a
                        href={app.githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-1 block"
                      >
                        {app.githubRepoUrl}
                      </a>
                      {app.stars !== undefined && (
                        <p className="text-sm text-gray-500 mt-1">⭐ {app.stars} stars</p>
                      )}
                    </div>
                  </>
                )}

                {app.frappeCloudUrl && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Frappe Cloud URL</h3>
                      <a
                        href={app.frappeCloudUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-1 block"
                      >
                        {app.frappeCloudUrl}
                      </a>
                    </div>
                  </>
                )}

                {app.tags && app.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {app.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* README Tab */}
          <TabsContent value="readme">
            <Card>
              <CardHeader>
                <CardTitle>README</CardTitle>
              </CardHeader>
              <CardContent>
                {app.readme ? (
                  <>
                    <MarkdownViewer content={app.readme} />
                    <p className="text-xs text-gray-400 mt-4">
                      README fetched from GitHub • {app.readme.length} characters
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No README available</p>
                    {app.githubRepoUrl && (
                      <p className="text-sm text-gray-400">
                        GitHub URL is set, but README wasn&apos;t fetched. Try editing the app and clicking &quot;Fetch Data&quot;
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Documentation</h2>
              {canEdit && (
                <Button asChild>
                  <Link href={`/apps/${id}/docs/new`}>Add Documentation</Link>
                </Button>
              )}
            </div>

            {!docs || docs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No documentation yet</p>
                  {canEdit && (
                    <Button asChild className="mt-4">
                      <Link href={`/apps/${id}/docs/new`}>Add First Document</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {docs.map((doc: any) => (
                  <Card key={doc._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{doc.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(doc.updatedAt), "PPP")}
                          </p>
                        </div>
                        {canEdit && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/apps/${id}/docs/${doc._id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <MarkdownViewer content={doc.content} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Changelog Tab */}
          <TabsContent value="changelog" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Changelog</h2>
              {canEdit && (
                <Button asChild>
                  <Link href={`/apps/${id}/changelog/new`}>Add Changelog</Link>
                </Button>
              )}
            </div>

            {!changelogs || changelogs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No changelog entries yet</p>
                  {canEdit && (
                    <Button asChild className="mt-4">
                      <Link href={`/apps/${id}/changelog/new`}>Add First Entry</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {changelogs.map((changelog: any) => (
                  <Card key={changelog._id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Version {changelog.version}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(changelog.releaseDate), "PPP")}
                          </p>
                        </div>
                        <Badge variant="outline">{changelog.version}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <MarkdownViewer content={changelog.changes} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Attachments</h2>
              {canEdit && (
                <Button asChild>
                  <Link href={`/apps/${id}/attachments/upload`}>Upload File</Link>
                </Button>
              )}
            </div>

            {!attachments || attachments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No attachments yet</p>
                  {canEdit && (
                    <Button asChild className="mt-4">
                      <Link href={`/apps/${id}/attachments/upload`}>
                        Upload First File
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Filename
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Uploaded
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {attachments.map((attachment: any) => (
                        <tr key={attachment._id}>
                          <td className="px-6 py-4">
                            <a
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {attachment.filename}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {(attachment.fileSize / 1024).toFixed(2)} KB
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {format(new Date(attachment.uploadedAt), "PPP")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <a
                              href={attachment.fileUrl}
                              download
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Download
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          {canEdit && (
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>App Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild>
                    <Link href={`/apps/${id}/edit`}>Edit App Details</Link>
                  </Button>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Install Command</h3>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                      {app.githubRepoUrl
                        ? `bench get-app ${app.githubRepoUrl}\nbench --site [site-name] install-app ${app.name?.toLowerCase().replace(/\s+/g, "_")}`
                        : "Add GitHub repository URL to generate install command"}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

