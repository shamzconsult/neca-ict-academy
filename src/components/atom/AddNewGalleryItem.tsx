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
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MAX_UPLOAD_SIZE_BYTES, MAX_UPLOAD_SIZE_KB } from "@/const";

export type GalleryType = {
  _id: string;
  title: string;
  date: string;
  description: string;
  url: string;
  images: string[];
};

type GalleryItem = {
  title: string;
  description: string;
  date: string;
  image: File | null;
  id: string;
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
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [currentItem, setCurrentItem] = useState<GalleryItem>({
    title: "",
    description: "",
    date: "",
    image: null,
    id: crypto.randomUUID(),
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async (items: GalleryItem[]) => {
      const formData = new FormData();
      items.forEach((item) => {
        formData.append("title[]", item.title);
        formData.append("description[]", item.description);
        formData.append("date[]", item.date);
        if (item.image) formData.append("images[]", item.image);
      });
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Gallery items created successfully 🎉");
      resetForm();
    },
    onError: () => toast.error("Failed to create gallery items"),
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
    setGalleryItems([]);
    setCurrentItem({
      title: "",
      description: "",
      date: "",
      image: null,
      id: crypto.randomUUID(),
    });
    setEditingItemId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      toast.error(`Image must be less than ${MAX_UPLOAD_SIZE_KB}KB (1MB).`);
      return;
    }

    setCurrentItem({ ...currentItem, image: file });
  };

  const addItemToList = () => {
    if (!currentItem.title || !currentItem.date || !currentItem.image) {
      toast.error("Please fill in all required fields and select an image.");
      return;
    }

    if (galleryItems.length >= 6) {
      toast.error("You can only add up to 6 items at once.");
      return;
    }

    setGalleryItems([...galleryItems, currentItem]);
    setCurrentItem({
      title: "",
      description: "",
      date: "",
      image: null,
      id: crypto.randomUUID(),
    });
    setEditingItemId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeItem = (id: string) => {
    setGalleryItems(galleryItems.filter((item) => item.id !== id));
  };

  const editItem = (id: string) => {
    const itemToEdit = galleryItems.find((item) => item.id === id);
    if (itemToEdit) {
      setCurrentItem(itemToEdit);
      setEditingItemId(id);
      removeItem(id);
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }, 0);
    }
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (galleryItems.length === 0) {
      toast.error("Please add at least one gallery item.");
      return;
    }

    if (galleryToEdit) {
      const formDataToSend = new FormData();
      formDataToSend.append("title", currentItem.title);
      formDataToSend.append("date", currentItem.date);
      formDataToSend.append("description", currentItem.description);
      if (currentItem.image) {
        formDataToSend.append("images", currentItem.image);
      }
      updateMutation.mutate({ _id: galleryToEdit._id, formDataToSend });
    } else {
      createMutation.mutate(galleryItems);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        if (!openState) resetForm();
      }}
    >
      <DialogContent className='max-h-[90vh] lg:max-w-xl px-0'>
        <div ref={scrollAreaRef} />
        <DialogHeader className='px-6'>
          <DialogTitle>
            {galleryToEdit ? "Edit Gallery Item" : "Upload New Gallery Items"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='max-h-[70vh] px-6 pb-6'>
          {(galleryItems.length < 6 || editingItemId !== null) && (
            <form className='space-y-4'>
              <div className='space-y-2'>
                <Label>Title</Label>
                <Input
                  name='title'
                  value={currentItem.title}
                  onChange={handleChange}
                  required
                  placeholder='e.g. AI first month training'
                />
              </div>

              <div className='space-y-2'>
                <Label>Description</Label>
                <Textarea
                  name='description'
                  value={currentItem.description}
                  onChange={handleChange}
                  placeholder='Brief description...'
                  rows={4}
                />
              </div>
              <div className='space-y-2'>
                <Label>Date</Label>
                <Input
                  name='date'
                  value={currentItem.date}
                  onChange={handleChange}
                  required
                  placeholder='2024-06-14'
                />
              </div>
              <div className='space-y-2'>
                <Label>Upload Image</Label>
                <Input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {currentItem.image && (
                  <img
                    src={URL.createObjectURL(currentItem.image)}
                    alt='preview'
                    className='h-40 w-full object-cover rounded-md'
                  />
                )}
              </div>

              <Button
                type='button'
                onClick={addItemToList}
                className='w-full cursor-pointer'
                disabled={
                  !currentItem.title || !currentItem.date || !currentItem.image
                }
              >
                <Plus className='h-4 w-4' /> Add to Batch
              </Button>
            </form>
          )}

          {galleryItems.length > 0 && (
            <div className='space-y-4 mt-4'>
              <h3 className='font-semibold'>
                Batch Items ({galleryItems.length}/6)
              </h3>
              <div className='space-y-3'>
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className='p-3 border rounded-lg bg-gray-50 flex items-center gap-3'
                  >
                    {item.image && (
                      <div className='w-16 h-16 flex-shrink-0'>
                        <img
                          src={URL.createObjectURL(item.image)}
                          alt={item.title}
                          className='w-full h-full object-cover rounded-md'
                        />
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium truncate'>{item.title}</h4>
                      <p className='text-sm text-gray-500'>{item.date}</p>
                      {item.description && (
                        <p className='text-sm text-gray-600 truncate mt-1'>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className='flex gap-2 flex-shrink-0'>
                      <button
                        type='button'
                        onClick={() => editItem(item.id)}
                        className={`p-1 hover:bg-gray-200 rounded${editingItemId !== null && editingItemId !== item.id ? " cursor-not-allowed opacity-50" : ""}`}
                        disabled={
                          editingItemId !== null && editingItemId !== item.id
                        }
                      >
                        <Pencil className='h-4 w-4 text-blue-600' />
                      </button>
                      <button
                        type='button'
                        onClick={() => removeItem(item.id)}
                        className={`p-1 hover:bg-gray-200 rounded${editingItemId !== null && editingItemId !== item.id ? " cursor-not-allowed opacity-50" : ""}`}
                        disabled={
                          editingItemId !== null && editingItemId !== item.id
                        }
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={(e) => handleSubmit(e)}
            disabled={
              editingItemId !== null || loading || galleryItems.length === 0
            }
            className='w-full cursor-pointer mt-4'
          >
            {galleryToEdit ? "Update" : "Upload Batch"}
            {loading && <Loader2 className='h-4 w-4 animate-spin' />}
          </Button>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
