"use client";

import { CourseType } from "@/types";
import React, { useRef, useState } from "react";
import { FiImage } from "react-icons/fi";
import Swal from "sweetalert2";

type AddNewCourseProps = {
  toggleModal: () => void;
  setCourseList: React.Dispatch<React.SetStateAction<CourseType[]>>;
  editingMode: CourseType | null;
  setEditingMode: (course: CourseType | null) => void;
  formData: {
    title: string;
    description: string;
    lesson: string;
    duration: string;
    rating: string;
    review: string;
    skillLevel: string;
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
    }>
  >;
};

export const AddNewCourse = ({
  toggleModal,
  setCourseList,
  editingMode,
  setEditingMode,
  formData,
  setFormData,
}: AddNewCourseProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("lesson", formData.lesson);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("rating", formData.rating);
    formDataToSend.append("review", formData.review);
    formDataToSend.append("skillLevel", formData.skillLevel);
    formDataToSend.append("coverImage", file);

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
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Course Created Successfully🎉🎉",
      });

      setFormData({
        title: "",
        description: "",
        lesson: "",
        duration: "",
        rating: "",
        review: "",
        skillLevel: "",
      });
      setFile(null);
      toggleModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMode) return;

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("lesson", formData.lesson);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("rating", formData.rating);
    formDataToSend.append("review", formData.review);
    formDataToSend.append("skillLevel", formData.skillLevel);

    if (file) {
      formDataToSend.append("coverImage", file);
    }

    try {
      const res = await fetch(`/api/course/${editingMode.slug}`, {
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
          course.slug === editingMode.slug ? responseData.updatedCourse : course
        )
      );

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Course Updated Successfully 🎉",
      });

      setEditingMode(null);
      setFormData({
        title: "",
        description: "",
        lesson: "",
        duration: "",
        rating: "",
        review: "",
        skillLevel: "",
      });
      setFile(null);
      toggleModal();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="fixed lg:sticky h-screen inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px]">
        <h2 className="text-xl font-bold mb-4">Add New Course</h2>
        {/* <Toaster /> */}
        <form
          onSubmit={editingMode ? handleUpdate : handleSubmit}
          className="space-y-4 "
        >
          <div>
            <label className="block text-sm font-semibold mb-1">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-[#C4C4C4] rounded-md"
              placeholder="Software Engineering"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-semibold mb-1">
              Course Slug
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-[#C4C4C4] rounded-md"
              placeholder="software-engineering"
            />
          </div> */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              name="description"
              className="w-full p-2 border border-[#C4C4C4] rounded-md"
              placeholder="Write a brief description here..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold  mb-1">
              Upload Cover Image
            </label>
            <div className="relative h-14">
              <div className="flex items-center gap-3 p-3 h-full border border-[#C4C4C4] rounded-md focus-within:ring focus-within:ring-[#C4C4C4] cursor-pointer">
                <FiImage className="text-[#C4C4C4]  text-xl flex-shrink-0" />

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Lesson</label>
              <input
                type="text"
                name="lesson"
                value={formData.lesson}
                onChange={handleChange}
                required
                placeholder="140"
                className="w-full p-2 border border-[#C4C4C4] rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="8 weeks"
                className="w-full p-2 border border-[#C4C4C4] rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Rating</label>
              <input
                type="text"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                placeholder="4.0"
                className="w-full p-2 border border-[#C4C4C4] rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Review</label>
              <input
                type="text"
                name="review"
                value={formData.review}
                onChange={handleChange}
                required
                placeholder="48 reviews"
                className="w-full p-2 border border-[#C4C4C4] rounded-md"
              />
            </div>
          </div>
          <div className="mt-1">
            <p className="block text-sm font-semibold mb-1">
              Select Skill Level
            </p>
            <select
              className="w-full p-2 border border-[#C4C4C4] rounded-md"
              name="skillLevel"
              id="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
            >
              <option value="">Select skill level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-center space-x-2 mt-4">
            <button
              type="submit"
              className={`px-4 py-2 ${
                editingMode
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-[#E02B20]  hover:bg-[#e02a20ce]"
              }  duration-300 text-white w-full rounded-md cursor-pointer`}
            >
              {editingMode ? "Update Course" : "Add Course"}
            </button>
            <button
              className="px-4 py-2 bg-black text-white rounded-md w-full cursor-pointer hover:bg-black/80"
              onClick={() => {
                toggleModal();
                setEditingMode(null);
                setFormData({
                  title: "",
                  description: "",
                  lesson: "",
                  duration: "",
                  rating: "",
                  review: "",
                  skillLevel: "",
                });
                setFile(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
