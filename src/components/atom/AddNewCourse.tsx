"use client";

import { CourseType } from "@/types";
import React, { useRef, useState } from "react";
import { FiImage } from "react-icons/fi";
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

type AddNewCourseProps = {
  toggleModal: () => void;
  courseToEdit: CourseType | null;
  setCourseToEdit: (course: CourseType | null) => void;
  formData: {
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
  setFormData: React.Dispatch<
    React.SetStateAction<{
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
    }>
  >;
  open: boolean;
};

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
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const addCourseMutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      const res = await fetch("/api/courses", {
        method: "POST",
        body: formDataToSend,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course Created Successfully 🎉");
      setFormData({
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
      });
      setFile(null);
      toggleModal();
    },
    onError: () => {
      toast.error("Failed to create course");
    },
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
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
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course Updated Successfully 🎉");
      setCourseToEdit(null);
      setFormData({
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
      });
      setFile(null);
      toggleModal();
    },
    onError: () => {
      toast.error("Failed to update course");
    },
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error("No file selected");
      return;
    }
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("lesson", formData.lesson);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("rating", formData.rating);
    formDataToSend.append("review", formData.review);
    formDataToSend.append("skillLevel", formData.skillLevel);
    formDataToSend.append("hasCertificate", String(formData.hasCertificate));
    formDataToSend.append("type", formData.type);
    formDataToSend.append("coverImage", file);
    formDataToSend.append(
      "courseOutlines",
      JSON.stringify(formData.courseOutlines)
    );
    addCourseMutation.mutate(formDataToSend);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courseToEdit) return;
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("lesson", formData.lesson);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("rating", formData.rating);
    formDataToSend.append("review", formData.review);
    formDataToSend.append("skillLevel", formData.skillLevel);
    formDataToSend.append("hasCertificate", String(formData.hasCertificate));
    formDataToSend.append("type", formData.type);
    if (file) {
      formDataToSend.append("coverImage", file);
    }
    formDataToSend.append(
      "courseOutlines",
      JSON.stringify(formData.courseOutlines)
    );
    updateCourseMutation.mutate({ slug: courseToEdit.slug, formDataToSend });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        if (!openState) {
          toggleModal();
          setCourseToEdit(null);
          setFormData({
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
          });
          setFile(null);
        }
      }}
    >
      <DialogContent className='max-h-[90vh] lg:max-w-xl px-0'>
        <DialogHeader className='px-6'>
          <DialogTitle>
            {courseToEdit ? "Edit Course" : "Add New Course"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={courseToEdit ? handleUpdate : handleSubmit}
          className='space-y-4'
        >
          <ScrollArea className='h-[calc(90vh-450px)] px-6'>
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label>Course Title</Label>
                <Input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  placeholder='Software Engineering'
                  required
                />
              </div>

              <div className='space-y-1'>
                <Label>Description</Label>
                <Textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  placeholder='Write a brief description here...'
                  required
                />
              </div>

              <div className='space-y-1 cursor-pointer'>
                <Label>Upload Cover Image</Label>
                <div className='relative'>
                  {(file || courseToEdit?.coverImage) && (
                    <div className='mb-4 relative'>
                      <img
                        src={
                          file
                            ? URL.createObjectURL(file)
                            : courseToEdit?.coverImage
                        }
                        alt='Cover preview'
                        className='w-full h-48 object-cover rounded-lg'
                      />
                      <button
                        type='button'
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className='flex items-center gap-3'>
                    <Input
                      type='file'
                      accept='image/*'
                      className='cursor-pointer'
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file && file.size > 307200) {
                          alert("File size must be less than 300KB.");
                          e.target.value = "";
                          setFile(null);
                          return;
                        }
                        setFile(file);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1 space-y-1'>
                  <Label>Lesson</Label>
                  <Input
                    type='number'
                    name='lesson'
                    value={formData.lesson}
                    onChange={handleChange}
                    placeholder='140'
                    required
                  />
                </div>
                <div className='flex-1 space-y-1'>
                  <Label>Duration</Label>
                  <Input
                    type='text'
                    name='duration'
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder='8 weeks'
                    required
                  />
                </div>
              </div>

              {/* <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <Label>Rating</Label>
                <Input
                  type="text"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="4.0"
                  required
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label>Review</Label>
                <Input
                  type="text"
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  placeholder="48 reviews"
                  required
                />
              </div>
            </div> */}

              <div className='space-y-1 w-full'>
                <Label>Skill Level</Label>
                <Select
                  value={formData.skillLevel}
                  onValueChange={(value) => {
                    setFormData({ ...formData, skillLevel: value });
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select skill level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Beginner'>Beginner</SelectItem>
                    <SelectItem value='Intermediate'>Intermediate</SelectItem>
                    <SelectItem value='Advanced'>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-1 w-full'>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    setFormData({ ...formData, type: value });
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select course type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Physical'>Physical</SelectItem>
                    <SelectItem value='Virtual'>Virtual</SelectItem>
                    <SelectItem value='Hybrid'>Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='hasCertificate'
                  checked={formData.hasCertificate}
                  onCheckedChange={(checked: boolean) => {
                    setFormData({
                      ...formData,
                      hasCertificate: checked,
                    });
                  }}
                />
                <Label htmlFor='hasCertificate'>
                  This course offers a certificate
                </Label>
              </div>

              <div className='space-y-2'>
                <Label>Course Outline</Label>
                {formData.courseOutlines.map((outline, index) => (
                  <div key={index} className='border p-3 rounded-md space-y-2'>
                    <Input
                      type='text'
                      placeholder='Outline Header'
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
                      <div className='flex flex-wrap gap-2 mb-2'>
                        {outline.lists.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className='bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2'
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
                        placeholder='Type and press comma or enter to add items'
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
                        className='cursor-pointer text-[#e02a20ce] hover:text-[#e02a20ce]'
                        size='sm'
                        onClick={() => {
                          const newOutlines = formData.courseOutlines.filter(
                            (_, i) => i !== index
                          );
                          setFormData({
                            ...formData,
                            courseOutlines: newOutlines,
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  className='cursor-pointer'
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
            </div>
          </ScrollArea>

          <DialogFooter className='flex flex-col md:flex-row gap-2 mt-6 px-6'>
            <Button
              type='submit'
              disabled={loading}
              className={`px-4 py-2 ${
                courseToEdit
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-[#E02B20]  hover:bg-[#e02a20ce]"
              }  duration-300 text-white  rounded-md cursor-pointer w-1/2 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? "Loading..."
                : courseToEdit
                  ? "Update Course"
                  : "Add Course"}
            </Button>
            <Button
              type='button'
              variant='outline'
              className='px-4 py-2 hover:text-white bg-black text-white rounded-md w-1/2 cursor-pointer hover:bg-black/80'
              onClick={() => {
                toggleModal();
                setCourseToEdit(null);
                setFormData({
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
                });
                setFile(null);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
