"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  Megaphone,
  Pencil,
  PlusCircle,
  Trash2,
  ZoomIn,
} from "lucide-react";
import {
  AnnouncementPreviewDialog,
  type AnnouncementPreviewItem,
} from "@/components/molecules/admin/announcements/AnnouncementPreviewDialog";
import { toast } from "sonner";
import { AdminSectionHeader } from "@/components/atom/AdminSectionHeader";
import EmptyState from "@/components/atom/EmptyState";
import { FormErrorBanner } from "@/components/atom/form/FormFeedback";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseApiError } from "@/lib/parse-api-error";
import { MAX_UPLOAD_SIZE_BYTES, MAX_UPLOAD_SIZE_KB } from "@/const";
import type { AnnouncementType } from "@/types";
import { cn } from "@/lib/utils";

const EMPTY_FORM = {
  title: "",
  active: true,
  hidden: false,
  sortOrder: "0",
  image: null as File | null,
};

function buildUpdateFormData(
  item: AnnouncementType,
  patch: Partial<Pick<AnnouncementType, "active" | "hidden" | "sortOrder">>,
) {
  const formData = new FormData();
  formData.append("title", item.title);
  formData.append("active", (patch.active ?? item.active) ? "true" : "false");
  formData.append("hidden", (patch.hidden ?? item.hidden) ? "true" : "false");
  formData.append("sortOrder", String(patch.sortOrder ?? item.sortOrder));
  return formData;
}

export function ManageAnnouncements() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AnnouncementType | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewItem, setPreviewItem] =
    useState<AnnouncementPreviewItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const openPreview = (item: AnnouncementPreviewItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const { data, isLoading, error } = useQuery<{
    success: boolean;
    data: AnnouncementType[];
  }>({
    queryKey: ["announcements", "all"],
    queryFn: async () => {
      const res = await fetch("/api/announcements?all=true");
      if (!res.ok) throw new Error("Failed to fetch announcements");
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const announcements = data?.data ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["announcements"] });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setForm({
      ...EMPTY_FORM,
      sortOrder: String(announcements.length),
    });
    setDialogOpen(true);
  };

  const openEdit = (item: AnnouncementType) => {
    setEditing(item);
    setForm({
      title: item.title,
      active: item.active,
      hidden: item.hidden,
      sortOrder: String(item.sortOrder),
      image: null,
    });
    setPreviewUrl(item.url);
    setFormError("");
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      toast.error(`Image must be less than ${MAX_UPLOAD_SIZE_KB}KB`);
      return;
    }

    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setForm((prev) => ({ ...prev, image: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editing && !form.image) {
        throw new Error("Please upload an announcement image.");
      }

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("active", form.active ? "true" : "false");
      formData.append("hidden", form.hidden ? "true" : "false");
      formData.append("sortOrder", form.sortOrder);
      if (form.image) formData.append("image", form.image);

      const res = editing
        ? await fetch(`/api/announcements/${editing._id}`, {
            method: "PUT",
            body: formData,
          })
        : await fetch("/api/announcements", {
            method: "POST",
            body: formData,
          });

      if (!res.ok) {
        throw new Error(
          await parseApiError(
            res,
            editing
              ? "Failed to update announcement"
              : "Failed to create announcement",
          ),
        );
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(editing ? "Announcement updated" : "Announcement created");
      invalidate();
      setDialogOpen(false);
      setEditing(null);
      resetForm();
    },
    onError: (err: Error) => {
      setFormError(err.message);
      toast.error(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(
          await parseApiError(res, "Failed to delete announcement"),
        );
      }
    },
    onSuccess: () => {
      toast.success("Announcement deleted");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const patchMutation = useMutation({
    mutationFn: async ({
      item,
      patch,
    }: {
      item: AnnouncementType;
      patch: Partial<Pick<AnnouncementType, "active" | "hidden" | "sortOrder">>;
    }) => {
      const res = await fetch(`/api/announcements/${item._id}`, {
        method: "PUT",
        body: buildUpdateFormData(item, patch),
      });
      if (!res.ok) {
        throw new Error(
          await parseApiError(res, "Failed to update announcement"),
        );
      }
    },
    onSuccess: () => invalidate(),
    onError: (err: Error) => toast.error(err.message),
  });

  const handleDelete = (item: AnnouncementType) => {
    if (!window.confirm(`Delete "${item.title || "this announcement"}"?`)) {
      return;
    }
    deleteMutation.mutate(item._id);
  };

  return (
    <>
      <AdminSectionHeader
        title='Homepage Announcements'
        icon={Megaphone}
        cta={
          <Button
            onClick={openCreate}
            className='gap-2 bg-[#27156F] text-white hover:bg-[#27156F]/90'
          >
            <PlusCircle className='size-4' />
            Add Announcement
          </Button>
        }
      />

      <p className='-mt-4 mb-6 text-sm text-gray-500'>
        Manage flyers in the homepage popup. Mark as{" "}
        <span className='font-medium text-[#E02B20]'>Open</span> for active
        campaigns, or <span className='font-medium text-[#27156F]'>Hide</span>{" "}
        to remove from the site without deleting.
      </p>

      {isLoading ? (
        <div className='space-y-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='h-[72px] animate-pulse rounded-xl bg-gray-100'
            />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title='Could not load announcements'
          message='Please refresh and try again.'
        />
      ) : announcements.length === 0 ? (
        <EmptyState
          title='No announcements yet'
          message='Upload a flyer to show on the homepage popup.'
        />
      ) : (
        <div className='overflow-hidden rounded-2xl border border-[#27156F]/10 bg-white'>
          {announcements.map((item, index) => (
            <div
              key={item._id}
              className={cn(
                "flex flex-col gap-3 border-b border-[#27156F]/5 p-4 last:border-0 sm:flex-row sm:items-center",
                item.hidden && "bg-gray-50/80",
              )}
            >
              <div className='flex min-w-0 flex-1 items-center gap-3 sm:gap-4'>
                <button
                  type='button'
                  onClick={() =>
                    openPreview({
                      title: item.title,
                      url: item.url,
                      active: item.active,
                      hidden: item.hidden,
                    })
                  }
                  className={cn(
                    "group relative size-14 shrink-0 overflow-hidden rounded-lg border border-[#27156F]/10 bg-[#DBEAF6]/30 transition hover:border-[#27156F]/30 sm:size-16",
                    item.hidden && "opacity-50",
                  )}
                  aria-label={`Preview ${item.title || "announcement"}`}
                >
                  <img
                    src={item.url}
                    alt={item.title || "Announcement"}
                    className={cn(
                      "size-full object-cover",
                      !item.active && "grayscale",
                    )}
                  />
                  <span className='absolute inset-0 flex items-center justify-center bg-[#27156F]/0 transition group-hover:bg-[#27156F]/40'>
                    <ZoomIn className='size-5 text-white opacity-0 transition group-hover:opacity-100' />
                  </span>
                </button>

                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p
                      className={cn(
                        "truncate font-semibold text-[#27156F]",
                        item.hidden && "text-gray-500",
                      )}
                    >
                      {item.title || "Untitled announcement"}
                    </p>
                  </div>
                  <p className='mt-0.5 text-xs text-gray-500'>
                    Order {item.sortOrder + 1} · Position {index + 1} of{" "}
                    {announcements.length}
                  </p>
                  <div className='flex items-center gap-1 mt-1'>
                    <Badge
                      className={cn(
                        "border-0 text-[10px] uppercase",
                        item.active
                          ? "bg-[#E02B20] text-white"
                          : "bg-[#27156F]/80 text-white",
                      )}
                    >
                      {item.active ? "Open" : "Past"}
                    </Badge>
                    {item.hidden ? (
                      <Badge
                        variant='outline'
                        className='border-gray-200 bg-gray-100 text-gray-600'
                      >
                        Hidden
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className='flex shrink-0 flex-wrap items-center gap-1 sm:justify-end'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='size-8'
                  disabled={index === 0 || patchMutation.isPending}
                  onClick={() =>
                    patchMutation.mutate({
                      item,
                      patch: { sortOrder: item.sortOrder - 1 },
                    })
                  }
                  aria-label='Move up'
                >
                  <ArrowUp className='size-4' />
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='size-8'
                  disabled={
                    index === announcements.length - 1 ||
                    patchMutation.isPending
                  }
                  onClick={() =>
                    patchMutation.mutate({
                      item,
                      patch: { sortOrder: item.sortOrder + 1 },
                    })
                  }
                  aria-label='Move down'
                >
                  <ArrowDown className='size-4' />
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-8 text-xs'
                  disabled={patchMutation.isPending}
                  onClick={() =>
                    patchMutation.mutate({
                      item,
                      patch: { active: !item.active },
                    })
                  }
                >
                  {item.active ? "Mark past" : "Mark open"}
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-8 gap-1 text-xs'
                  onClick={() =>
                    openPreview({
                      title: item.title,
                      url: item.url,
                      active: item.active,
                      hidden: item.hidden,
                    })
                  }
                >
                  <ZoomIn className='size-3.5' />
                  Preview
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-8 gap-1 text-xs'
                  disabled={patchMutation.isPending}
                  onClick={() =>
                    patchMutation.mutate({
                      item,
                      patch: { hidden: !item.hidden },
                    })
                  }
                >
                  {item.hidden ? (
                    <>
                      <Eye className='size-3.5' />
                      Show
                    </>
                  ) : (
                    <>
                      <EyeOff className='size-3.5' />
                      Hide
                    </>
                  )}
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='size-8'
                  onClick={() => openEdit(item)}
                  aria-label='Edit'
                >
                  <Pencil className='size-4' />
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='size-8 text-red-600 hover:text-red-700'
                  onClick={() => handleDelete(item)}
                  aria-label='Delete'
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditing(null);
            resetForm();
          }
        }}
      >
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit announcement" : "Add announcement"}
            </DialogTitle>
          </DialogHeader>

          <form
            className='space-y-4'
            onSubmit={(e) => {
              e.preventDefault();
              setFormError("");
              saveMutation.mutate();
            }}
          >
            {formError ? <FormErrorBanner message={formError} /> : null}

            <div className='space-y-2'>
              <Label htmlFor='announcement-title'>Title (admin label)</Label>
              <Input
                id='announcement-title'
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder='e.g. ITF NECA June 2026 deadline'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='announcement-sort'>Display order</Label>
              <Input
                id='announcement-sort'
                type='number'
                min={0}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, sortOrder: e.target.value }))
                }
              />
            </div>

            <div className='flex items-center gap-2'>
              <Checkbox
                id='announcement-active'
                checked={form.active}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    active: checked === true,
                  }))
                }
              />
              <Label htmlFor='announcement-active' className='font-normal'>
                Open for applications (shows Apply Now &amp; auto-rotates)
              </Label>
            </div>

            <div className='flex items-center gap-2'>
              <Checkbox
                id='announcement-hidden'
                checked={form.hidden}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    hidden: checked === true,
                  }))
                }
              />
              <Label htmlFor='announcement-hidden' className='font-normal'>
                Hidden (kept in admin, not shown on homepage)
              </Label>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='announcement-image'>
                Flyer image{editing ? " (optional)" : ""}
              </Label>
              <Input
                id='announcement-image'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <div className='mt-2 space-y-2'>
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='max-h-48 w-full rounded-lg border bg-gray-50 object-contain'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='gap-1.5'
                    onClick={() =>
                      openPreview({
                        title: form.title,
                        url: previewUrl,
                        active: form.active,
                        hidden: form.hidden,
                      })
                    }
                  >
                    <ZoomIn className='size-3.5' />
                    Preview homepage popup
                  </Button>
                </div>
              ) : null}
              <p className='text-xs text-gray-500'>
                Max file size: {MAX_UPLOAD_SIZE_KB}KB (1MB). JPG, PNG, or WebP.
              </p>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={saveMutation.isPending}
                className='gap-2 bg-[#27156F] text-white hover:bg-[#27156F]/90'
              >
                {saveMutation.isPending && (
                  <Loader2 className='size-4 animate-spin' />
                )}
                {editing ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AnnouncementPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        item={previewItem}
      />
    </>
  );
}
