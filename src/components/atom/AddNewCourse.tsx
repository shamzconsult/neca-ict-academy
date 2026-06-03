"use client";

import { CourseType } from "@/types";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { CourseOutline } from "../molecules/admin/courses/ManageCourses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { MAX_UPLOAD_SIZE_BYTES, MAX_UPLOAD_SIZE_KB } from "@/const";
import { parseApiError } from "@/lib/parse-api-error";
import {
  FieldError,
  FormErrorBanner,
  fieldErrorClass,
} from "./form/FormFeedback";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type CourseFormData = {
  title: string;
  description: string;
  lesson: string;
  duration: string;
  rating: string;
  review: string;
  skillLevel: string;
  courseOutlines: CourseOutline[];
  hasCertificate: boolean;
  type: string;
};

type FieldErrors = Partial<Record<keyof CourseFormData | "coverImage", string>>;

type AddNewCourseProps = {
  toggleModal: () => void;
  courseToEdit: CourseType | null;
  setCourseToEdit: (course: CourseType | null) => void;
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
  open: boolean;
};

const EMPTY_FORM: CourseFormData = {
  title: "",
  description: "",
  lesson: "",
  duration: "",
  rating: "",
  review: "",
  skillLevel: "",
  courseOutlines: [],
  hasCertificate: false,
  type: "",
};

function validateCourseForm(
  data: CourseFormData,
  options: { isEdit: boolean; hasCover: boolean },
): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.title.trim()) errors.title = "Course title is required.";
  if (!data.description.trim()) errors.description = "Description is required.";
  if (!data.lesson.trim()) {
    errors.lesson = "Number of lessons is required.";
  } else if (Number(data.lesson) <= 0) {
    errors.lesson = "Lessons must be greater than zero.";
  }
  if (!data.duration.trim()) errors.duration = "Duration is required.";
  if (!data.skillLevel) errors.skillLevel = "Please select a skill level.";
  if (!data.type) errors.type = "Please select a course type.";
  if (!options.isEdit && !options.hasCover) {
    errors.coverImage = "Cover image is required.";
  }

  return errors;
}

function buildFormDataPayload(data: CourseFormData, file: File | null) {
  const formDataToSend = new FormData();
  formDataToSend.append("title", data.title.trim());
  formDataToSend.append("description", data.description.trim());
  formDataToSend.append("lesson", data.lesson);
  formDataToSend.append("duration", data.duration.trim());
  formDataToSend.append("rating", data.rating);
  formDataToSend.append("review", data.review);
  formDataToSend.append("skillLevel", data.skillLevel);
  formDataToSend.append("hasCertificate", String(data.hasCertificate));
  formDataToSend.append("type", data.type);
  if (file) formDataToSend.append("coverImage", file);
  formDataToSend.append("courseOutlines", JSON.stringify(data.courseOutlines));
  return formDataToSend;
}

export const AddNewCourse = ({
  toggleModal,
  courseToEdit,
  setCourseToEdit,
  formData,
  setFormData,
  open,
}: AddNewCourseProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState("");
  const queryClient = useQueryClient();

  const resetLocalState = () => {
    setFormData(EMPTY_FORM);
    setFile(null);
    setFieldErrors({});
    setApiError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setApiError("");
  };

  const addCourseMutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      const res = await fetch("/api/courses", {
        method: "POST",
        body: formDataToSend,
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Failed to create course"));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created successfully");
      resetLocalState();
      toggleModal();
    },
    onError: (error: Error) => {
      const message = error.message || "Failed to create course";
      setApiError(message);
      toast.error(message);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({
      slug,
      formDataToSend,
    }: {
      slug: string;
      formDataToSend: FormData;
    }) => {
      const res = await fetch(`/api/courses/${slug}`, {
        method: "PUT",
        body: formDataToSend,
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Failed to update course"));
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course updated successfully");
      setCourseToEdit(null);
      resetLocalState();
      toggleModal();
    },
    onError: (error: Error) => {
      const message = error.message || "Failed to update course";
      setApiError(message);
      toast.error(message);
    },
  });

  const isSubmitting =
    addCourseMutation.isPending || updateCourseMutation.isPending;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    clearFieldError(name as keyof FieldErrors);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    toggleModal();
    setCourseToEdit(null);
    resetLocalState();
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    const hasCover = !!file || !!courseToEdit?.coverImage;
    const errors = validateCourseForm(formData, {
      isEdit: !!courseToEdit,
      hasCover,
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please fix the errors below before submitting.");
      return;
    }

    setFieldErrors({});
    const payload = buildFormDataPayload(formData, file);

    if (courseToEdit) {
      updateCourseMutation.mutate({
        slug: courseToEdit.slug,
        formDataToSend: payload,
      });
    } else {
      addCourseMutation.mutate(payload);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected && selected.size > MAX_UPLOAD_SIZE_BYTES) {
      const message = `Image must be less than ${MAX_UPLOAD_SIZE_KB}KB (1MB).`;
      setFieldErrors((prev) => ({ ...prev, coverImage: message }));
      toast.error(message);
      e.target.value = "";
      setFile(null);
      return;
    }
    setFile(selected);
    clearFieldError("coverImage");
  };

  const coverPreview = file
    ? URL.createObjectURL(file)
    : courseToEdit?.coverImage;

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => !openState && handleClose()}
    >
      <DialogContent className='max-h-[90vh] px-0 sm:max-w-xl'>
        <DialogHeader className='px-6'>
          <DialogTitle>
            {courseToEdit ? "Edit Course" : "Add New Course"}
          </DialogTitle>
          <p className='text-sm text-muted-foreground'>
            {courseToEdit
              ? "Update course details and cover image."
              : "Fill in the details to publish a new course."}
          </p>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className='space-y-4' noValidate>
          <div className='px-6'>
            <FormErrorBanner
              message={apiError}
              onDismiss={() => setApiError("")}
            />
          </div>

          <ScrollArea className='h-[calc(90vh-280px)] px-6'>
            <div className='space-y-4 pb-2'>
              <div className='space-y-1'>
                <Label>
                  Course Title <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  placeholder='Software Engineering'
                  aria-invalid={!!fieldErrors.title}
                  className={fieldErrorClass(!!fieldErrors.title)}
                />
                <FieldError message={fieldErrors.title} />
              </div>

              <div className='space-y-1'>
                <Label>
                  Description <span className='text-red-500'>*</span>
                </Label>
                <Textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder='Write a brief description here...'
                  aria-invalid={!!fieldErrors.description}
                  className={fieldErrorClass(!!fieldErrors.description)}
                />
                <FieldError message={fieldErrors.description} />
              </div>

              <div className='space-y-2'>
                <Label>
                  Cover Image{" "}
                  {!courseToEdit && <span className='text-red-500'>*</span>}
                </Label>
                {coverPreview && (
                  <div className='relative mb-2'>
                    <img
                      src={coverPreview}
                      alt='Cover preview'
                      className='h-48 w-full rounded-lg object-cover'
                    />
                    {file && (
                      <button
                        type='button'
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className='absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600'
                        aria-label='Remove image'
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
                <Input
                  type='file'
                  accept='image/*'
                  className={cn(
                    "cursor-pointer",
                    fieldErrorClass(!!fieldErrors.coverImage),
                  )}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  aria-invalid={!!fieldErrors.coverImage}
                />
                <p className='text-xs text-gray-500'>
                  Max file size: {MAX_UPLOAD_SIZE_KB}KB (1MB). JPG, PNG, or
                  WebP.
                </p>
                <FieldError message={fieldErrors.coverImage} />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-1'>
                  <Label>
                    Lessons <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    type='number'
                    name='lesson'
                    min={1}
                    value={formData.lesson}
                    onChange={handleChange}
                    placeholder='140'
                    aria-invalid={!!fieldErrors.lesson}
                    className={fieldErrorClass(!!fieldErrors.lesson)}
                  />
                  <FieldError message={fieldErrors.lesson} />
                </div>
                <div className='space-y-1'>
                  <Label>
                    Duration <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    type='text'
                    name='duration'
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder='8 weeks'
                    aria-invalid={!!fieldErrors.duration}
                    className={fieldErrorClass(!!fieldErrors.duration)}
                  />
                  <FieldError message={fieldErrors.duration} />
                </div>
              </div>

              <div className='space-y-1'>
                <Label>
                  Skill Level <span className='text-red-500'>*</span>
                </Label>
                <Select
                  value={formData.skillLevel}
                  onValueChange={(value) => {
                    setFormData({ ...formData, skillLevel: value });
                    clearFieldError("skillLevel");
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      fieldErrorClass(!!fieldErrors.skillLevel),
                    )}
                  >
                    <SelectValue placeholder='Select skill level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Beginner'>Beginner</SelectItem>
                    <SelectItem value='Intermediate'>Intermediate</SelectItem>
                    <SelectItem value='Advanced'>Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={fieldErrors.skillLevel} />
              </div>

              <div className='space-y-1'>
                <Label>
                  Type <span className='text-red-500'>*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    setFormData({ ...formData, type: value });
                    clearFieldError("type");
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      fieldErrorClass(!!fieldErrors.type),
                    )}
                  >
                    <SelectValue placeholder='Select course type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Physical'>Physical</SelectItem>
                    <SelectItem value='Virtual'>Virtual</SelectItem>
                    <SelectItem value='Hybrid'>Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={fieldErrors.type} />
              </div>

              <div className='space-y-2'>
                <Label>Course Outline</Label>
                {formData.courseOutlines.map((outline, index) => (
                  <div key={index} className='space-y-2 rounded-lg border p-3'>
                    <Input
                      type='text'
                      placeholder='Section title'
                      value={outline.header}
                      onChange={(e) => {
                        const newOutlines = [...formData.courseOutlines];
                        newOutlines[index].header = e.target.value;
                        setFormData({
                          ...formData,
                          courseOutlines: newOutlines,
                        });
                      }}
                    />
                    <div className='space-y-2'>
                      <div className='flex flex-wrap gap-2'>
                        {outline.lists.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className='flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm'
                          >
                            <span>{item}</span>
                            <button
                              type='button'
                              className='text-red-500 hover:text-red-700'
                              onClick={() => {
                                const newOutlines = [
                                  ...formData.courseOutlines,
                                ];
                                newOutlines[index].lists = newOutlines[
                                  index
                                ].lists.filter((_, i) => i !== itemIndex);
                                setFormData({
                                  ...formData,
                                  courseOutlines: newOutlines,
                                });
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <Input
                        type='text'
                        placeholder='Type and press Enter or comma to add items'
                        value={outline.currentInput || ""}
                        onChange={(e) => {
                          const newOutlines = [...formData.courseOutlines];
                          newOutlines[index].currentInput = e.target.value;
                          setFormData({
                            ...formData,
                            courseOutlines: newOutlines,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "," || e.key === "Enter") {
                            e.preventDefault();
                            const newOutlines = [...formData.courseOutlines];
                            const value =
                              newOutlines[index].currentInput?.trim();
                            if (value) {
                              newOutlines[index].lists = [
                                ...newOutlines[index].lists,
                                value,
                              ];
                              newOutlines[index].currentInput = "";
                              setFormData({
                                ...formData,
                                courseOutlines: newOutlines,
                              });
                            }
                          }
                        }}
                      />
                    </div>
                    <div className='flex justify-end'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='text-[#E02B20] hover:text-[#E02B20]'
                        onClick={() => {
                          setFormData({
                            ...formData,
                            courseOutlines: formData.courseOutlines.filter(
                              (_, i) => i !== index,
                            ),
                          });
                        }}
                      >
                        Remove section
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    setFormData({
                      ...formData,
                      courseOutlines: [
                        ...formData.courseOutlines,
                        { header: "", lists: [] },
                      ],
                    })
                  }
                >
                  + Add Section
                </Button>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='hasCertificate'
                  checked={formData.hasCertificate}
                  onCheckedChange={(checked: boolean) => {
                    setFormData({ ...formData, hasCertificate: checked });
                  }}
                />
                <Label htmlFor='hasCertificate' className='font-normal'>
                  This course offers a certificate
                </Label>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className='flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
              className='border-[#27156F]/20'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='gap-2 bg-[#27156F] text-white hover:bg-[#27156F]/90'
            >
              {isSubmitting ? (
                <Loader2 className='size-4 animate-spin' />
              ) : courseToEdit ? (
                "Update Course"
              ) : (
                "Add Course"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
