"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type GalleryType = {
  _id: string;
  title: string;
  date: string;
  description: string;
  url: string;
  images: string[];
};

type GalleryFormProps = {
  open: boolean;
  toggleModal: () => void;
  galleryToEdit: GalleryType | null;
  setGalleryToEdit: (item: GalleryType | null) => void;
  formData: {
    title: string;
    description: string;
    date: string;
    images: File[];
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      date: string;
      images: File[];
    }>
  >;
};

export const AddNewGalleryItem = ({
  open,
  toggleModal,
  galleryToEdit,
  setGalleryToEdit,
  formData,
  setFormData,
}: GalleryFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formDataToSend,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Gallery item created successfully 🎉");
      resetForm();
    },
    onError: () => toast.error("Failed to create gallery item"),
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      _id,
      formDataToSend,
    }: {
      _id: string;
      formDataToSend: FormData;
    }) => {
      const res = await fetch(`/api/gallery/${_id}`, {
        method: "PUT",
        body: formDataToSend,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Gallery item updated successfully 🎉");
      resetForm();
    },
    onError: () => toast.error("Failed to update gallery item"),
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
  });

  const resetForm = () => {
    toggleModal();
    setGalleryToEdit(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      images: [],
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    if (fileArray.length > 6) {
      toast.error("You can only upload up to 5 images at once.");
      return;
    }
    const tooLarge = fileArray.some((file) => file.size > 307200);
    if (tooLarge) {
      toast.error("Each image must be less than 300KB.");
      return;
    }
    setFormData({ ...formData, images: fileArray });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.images.length === 0 && !galleryToEdit) {
      toast.error("Please upload at least one image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("description", formData.description);

    formData.images.forEach((img, i) => {
      formDataToSend.append("images", img, `image-${i}`);
    });

    if (galleryToEdit) {
      updateMutation.mutate({ _id: galleryToEdit._id, formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        if (!openState) resetForm();
      }}
    >
      <DialogContent className="max-h-[90vh] lg:max-w-xl px-0">
        <DialogHeader className="px-6">
          <DialogTitle>
            {galleryToEdit ? "Edit Gallery Item" : "Add New Gallery Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. AI first month training"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              placeholder="2024-06-14"
            />
          </div>
          <div className="space-y-2">
            <Label>Upload Images (Max 6)</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="grid grid-cols-3 gap-2">
              {formData.images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${i}`}
                  className="h-24 w-full object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer"
          >
            {galleryToEdit ? "Update" : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
