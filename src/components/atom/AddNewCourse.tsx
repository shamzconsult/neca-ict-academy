"use client";

import { CourseType } from "@/types";
import React, { useRef, useState } from "react";
import { FiImage } from "react-icons/fi";
import Swal from "sweetalert2";
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

type AddNewCourseProps = {
  toggleModal: () => void;
  setCourseList: React.Dispatch<React.SetStateAction<CourseType[]>>;
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
    }>
  >;
  open: boolean;
};

export const AddNewCourse = ({
  toggleModal,
  setCourseList,
  courseToEdit,
  setCourseToEdit,
  formData,
  setFormData,
  open,
}: AddNewCourseProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

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
      console.error("No file selected");
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
    formDataToSend.append("coverImage", file);
    formDataToSend.append(
      "courseOutlines",
      JSON.stringify(formData.courseOutlines)
    );

    try {
      const res = await fetch("/api/course", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error creating course:", errorText);
        return;
      }

      const responseData = await res.json();
      setCourseList((prevOffers) => [...prevOffers, responseData.newCourse]);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Course Created Successfully 🎉",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setFormData({
        title: "",
        description: "",
        lesson: "",
        duration: "",
        rating: "",
        review: "",
        skillLevel: "",
        courseOutlines: [],
      });
      setFile(null);
      toggleModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
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
    formDataToSend.append(
      "courseOutlines",
      JSON.stringify(formData.courseOutlines)
    );

    if (file) {
      formDataToSend.append("coverImage", file);
    }

    try {
      const res = await fetch(`/api/course/${courseToEdit.slug}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error updating course:", errorText);
        return;
      }

      const responseData = await res.json();
      setCourseList((prev) =>
        prev.map((course) =>
          course.slug === courseToEdit.slug
            ? responseData.updatedCourse
            : course
        )
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Course Updated Successfully 🎉",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

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
      });
      setFile(null);
      toggleModal();
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setLoading(false);
    }
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
          });
          setFile(null);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {courseToEdit ? "Edit Course" : "Add New Course"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={courseToEdit ? handleUpdate : handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label>Course Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Software Engineering"
              required
            />
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              placeholder="Write a brief description here..."
              required
            />
          </div>

          <div className="space-y-1 cursor-pointer">
            <Label>Upload Cover Image</Label>
            <div className="flex items-center gap-3 cursor-pointer">
              <FiImage className="text-gray-400 text-xl" />
              <Input
                type="file"
                accept="image/*"
                className="cursor-pointer"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-1">
              <Label>Lesson</Label>
              <Input
                type="text"
                name="lesson"
                value={formData.lesson}
                onChange={handleChange}
                placeholder="140"
                required
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label>Duration</Label>
              <Input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="8 weeks"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
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
          </div>

          <div className="space-y-1 w-full">
            <Label>Skill Level</Label>
            <Select
              value={formData.skillLevel}
              onValueChange={(value) => {
                setFormData({ ...formData, skillLevel: value });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Course Outline</Label>
            {formData.courseOutlines.map((outline, index) => (
              <div key={index} className="border p-3 rounded-md space-y-2">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="cursor-pointer text-[#e02a20ce] hover:text-[#e02a20ce]"
                    size="sm"
                    onClick={() => {
                      const newOutlines = formData.courseOutlines.filter(
                        (_, i) => i !== index
                      );
                      setFormData({ ...formData, courseOutlines: newOutlines });
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <Input
                  type="text"
                  placeholder="Outline Header"
                  value={outline.header}
                  onChange={(e) => {
                    const newOutlines = [...formData.courseOutlines];
                    newOutlines[index].header = e.target.value;
                    setFormData({ ...formData, courseOutlines: newOutlines });
                  }}
                />
                <Textarea
                  rows={3}
                  placeholder="Comma separated list"
                  value={outline.lists.join(", ")}
                  onChange={(e) => {
                    const newOutlines = [...formData.courseOutlines];
                    newOutlines[index].lists = e.target.value
                      .split(",")
                      .map((item) => item.trim());
                    setFormData({ ...formData, courseOutlines: newOutlines });
                  }}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
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

          <DialogFooter className="flex flex-col md:flex-row gap-2 mt-6">
            <Button
              type="submit"
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
              type="button"
              variant="outline"
              className="px-4 py-2 hover:text-white bg-black text-white rounded-md w-1/2 cursor-pointer hover:bg-black/80"
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
