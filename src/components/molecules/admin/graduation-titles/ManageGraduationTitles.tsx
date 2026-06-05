"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminSectionHeader } from "@/components/atom/AdminSectionHeader";
import EmptyState from "@/components/atom/EmptyState";
import { FormErrorBanner } from "@/components/atom/form/FormFeedback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { parseApiError } from "@/lib/parse-api-error";
import type { GraduationTitleType } from "@/types";
import { HonorBadge } from "@/components/molecules/admin/graduates/HonorBadge";

const EMPTY_FORM = {
  name: "",
  description: "",
  scope: "course" as "course" | "cohort",
  maxWinners: "1",
  badgeColor: "#27156F",
  active: true,
  sortOrder: "0",
};

export function ManageGraduationTitles() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GraduationTitleType | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const { data, isLoading, error } = useQuery<{
    success: boolean;
    data: GraduationTitleType[];
  }>({
    queryKey: ["graduation-titles", "all"],
    queryFn: async () => {
      const res = await fetch("/api/graduation-titles?activeOnly=false");
      if (!res.ok) throw new Error("Failed to fetch graduation titles");
      return res.json();
    },
  });

  const titles = data?.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setDialogOpen(true);
  };

  const openEdit = (title: GraduationTitleType) => {
    setEditing(title);
    setForm({
      name: title.name,
      description: title.description,
      scope: title.scope,
      maxWinners: String(title.maxWinners),
      badgeColor: title.badgeColor,
      active: title.active,
      sortOrder: String(title.sortOrder),
    });
    setFormError("");
    setDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        scope: form.scope,
        maxWinners: Number(form.maxWinners),
        badgeColor: form.badgeColor,
        active: form.active,
        sortOrder: Number(form.sortOrder),
      };

      const res = editing
        ? await fetch(`/api/graduation-titles/${editing._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/graduation-titles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        throw new Error(
          await parseApiError(
            res,
            editing ? "Failed to update title" : "Failed to create title",
          ),
        );
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(editing ? "Title updated" : "Title created");
      queryClient.invalidateQueries({ queryKey: ["graduation-titles"] });
      setDialogOpen(false);
      setFormError("");
    },
    onError: (err: Error) => {
      setFormError(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/graduation-titles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Failed to delete title"));
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Title deleted");
      queryClient.invalidateQueries({ queryKey: ["graduation-titles"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await fetch(`/api/graduation-titles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Failed to update title");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graduation-titles"] });
    },
  });

  return (
    <>
      <AdminSectionHeader
        title='Graduation Titles'
        icon={Award}
        cta={
          <Button
            onClick={openCreate}
            className='gap-2 bg-[#27156F] text-white hover:bg-[#27156F]/90'
          >
            <PlusCircle className='size-4' />
            New title
          </Button>
        }
      />

      <p className='-mt-4 mb-6 text-sm text-gray-500'>
        Create reusable honors like &quot;Best Graduating Student&quot; and
        assign them to graduated students per cohort or course.
      </p>

      {error ? (
        <EmptyState
          title='Failed to load titles'
          message={error.message}
          size='lg'
        />
      ) : isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='h-16 animate-pulse rounded-xl bg-gray-100'
            />
          ))}
        </div>
      ) : titles.length === 0 ? (
        <EmptyState
          title='No graduation titles yet'
          message='Create your first title to start recognizing top graduates.'
          size='lg'
        />
      ) : (
        <div className='overflow-hidden rounded-2xl border border-[#27156F]/10'>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[640px] text-sm'>
              <thead className='border-b border-[#27156F]/10 bg-[#DBEAF6]/30 text-left'>
                <tr>
                  <th className='px-4 py-3 font-semibold text-[#27156F]'>
                    Title
                  </th>
                  <th className='px-4 py-3 font-semibold text-[#27156F]'>
                    Scope
                  </th>
                  <th className='px-4 py-3 font-semibold text-[#27156F]'>
                    Max winners
                  </th>
                  <th className='px-4 py-3 font-semibold text-[#27156F]'>
                    Status
                  </th>
                  <th className='px-4 py-3 font-semibold text-[#27156F]'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {titles.map((title) => (
                  <tr
                    key={title._id}
                    className='border-b border-[#27156F]/5 last:border-0'
                  >
                    <td className='px-4 py-3'>
                      <div className='flex flex-col items-start gap-1.5'>
                        <HonorBadge honor={title} />
                        {title.description && (
                          <span className='text-xs text-gray-500 line-clamp-2'>
                            {title.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-4 py-3 capitalize text-gray-600'>
                      {title.scope}
                    </td>
                    <td className='px-4 py-3 text-gray-600'>
                      {title.maxWinners === 0 ? "Unlimited" : title.maxWinners}
                    </td>
                    <td className='px-4 py-3'>
                      <Badge
                        variant='outline'
                        className={
                          title.active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-gray-50 text-gray-500"
                        }
                      >
                        {title.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='size-8'
                          onClick={() => openEdit(title)}
                          aria-label={`Edit ${title.name}`}
                        >
                          <Pencil className='size-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 text-xs'
                          onClick={() =>
                            toggleActiveMutation.mutate({
                              id: title._id,
                              active: !title.active,
                            })
                          }
                        >
                          {title.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='size-8 text-[#E02B20] hover:text-[#E02B20]'
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete "${title.name}"? This only works if no students have it assigned.`,
                              )
                            ) {
                              deleteMutation.mutate(title._id);
                            }
                          }}
                          aria-label={`Delete ${title.name}`}
                        >
                          <Trash2 className='size-4' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit graduation title" : "New graduation title"}
            </DialogTitle>
          </DialogHeader>

          {formError && (
            <FormErrorBanner
              message={formError}
              onDismiss={() => setFormError("")}
            />
          )}

          <div className='space-y-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='title-name'>Name</Label>
              <Input
                id='title-name'
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder='Best Graduating Student'
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='title-desc'>Description</Label>
              <Input
                id='title-desc'
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder='Optional description'
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1.5'>
                <Label>Scope</Label>
                <Select
                  value={form.scope}
                  onValueChange={(v: "course" | "cohort") =>
                    setForm((f) => ({ ...f, scope: v }))
                  }
                >
                  <SelectTrigger className='bg-white'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='course'>Per course</SelectItem>
                    <SelectItem value='cohort'>Per cohort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='max-winners'>Max winners</Label>
                <Input
                  id='max-winners'
                  type='number'
                  min={0}
                  value={form.maxWinners}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maxWinners: e.target.value }))
                  }
                />
                <p className='text-[10px] text-gray-400'>0 = unlimited</p>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1.5'>
                <Label htmlFor='badge-color'>Badge color</Label>
                <Input
                  id='badge-color'
                  type='color'
                  value={form.badgeColor}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, badgeColor: e.target.value }))
                  }
                  className='h-10 cursor-pointer p-1'
                />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='sort-order'>Sort order</Label>
                <Input
                  id='sort-order'
                  type='number'
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sortOrder: e.target.value }))
                  }
                />
              </div>
            </div>
            {form.name && (
              <div>
                <Label className='mb-2 block'>Preview</Label>
                <HonorBadge
                  honor={{ name: form.name, badgeColor: form.badgeColor }}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className='bg-[#27156F] text-white hover:bg-[#27156F]/90'
              disabled={!form.name.trim() || saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? (
                <Loader2 className='size-4 animate-spin' />
              ) : editing ? (
                "Save changes"
              ) : (
                "Create title"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
