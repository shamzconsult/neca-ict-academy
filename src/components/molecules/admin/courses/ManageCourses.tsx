"use client";

import { AddNewCourse } from "@/components/atom/AddNewCourse";
import { CourseCard } from "@/components/atom/CourseCard";
import { CourseType } from "@/types";
import React, { useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useDebounce } from "@/hooks/useDebounce";
import { ExternalLink, X } from "lucide-react";
import Link from "next/link";

export type CourseOutline = {
  header: string;
  lists: string[];
  currentInput?: string;
};

async function fetchCourses({
  search,
  skillLevel,
  sort,
  order,
  startDate,
  endDate,
}: {
  search?: string;
  skillLevel?: string;
  sort?: string;
  order?: string;
  startDate?: string;
  endDate?: string;
}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (skillLevel) params.set("skillLevel", skillLevel);
  if (sort) params.set("sort", sort);
  if (order) params.set("order", order);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  const res = await fetch(`/api/courses?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
}

export const ManageCourses = () => {
  const [showModal, setShowModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<CourseType | null>(null);
  const [formData, setFormData] = useState<{
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
  }>({
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

  // Filter/sort state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [skillLevel, setSkillLevel] = useState("all");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  const { data: courses = [], isLoading } = useQuery<CourseType[]>({
    queryKey: [
      "courses",
      {
        search: debouncedSearch,
        skillLevel: skillLevel === "all" ? undefined : skillLevel,
        sort,
        order,
        startDate: dateRange.start?.toISOString(),
        endDate: dateRange.end?.toISOString(),
      },
    ],
    queryFn: () =>
      fetchCourses({
        search: debouncedSearch,
        skillLevel: skillLevel === "all" ? undefined : skillLevel,
        sort,
        order,
        startDate: dateRange.start ? dateRange.start.toISOString() : undefined,
        endDate: dateRange.end ? dateRange.end.toISOString() : undefined,
      }),
    refetchOnMount: "always",
  });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div className='bg-white min-h-[95dvh] shadow-lg rounded-xl p-6'>
        <div className='flex flex-col md:flex-row gap-3 justify-between md:items-center mb-10'>
          <h1 className='text-2xl font-bold text-gray-800'>Course Overview</h1>
          <div className='flex gap-3'>
            <Button
              onClick={toggleModal}
              className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
            >
              <HiOutlinePlusCircle /> Add New Course
            </Button>{" "}
            <Button
              variant='outline'
              asChild
              className='flex items-center gap-2 transition-colors'
            >
              <Link href='/courses' target='_blank'>
                <ExternalLink />
                Go to Courses Page
              </Link>
            </Button>
          </div>
        </div>
        {/* Filter & Sort Controls */}
        <div className='flex gap-4 mb-6'>
          <div className='relative w-full'>
            <Input
              placeholder='Search course title...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pr-8'
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
          <div className='flex justify-between gap-4'>
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='Skill Level' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='Beginner'>Beginner</SelectItem>
                <SelectItem value='Intermediate'>Intermediate</SelectItem>
                <SelectItem value='Advanced'>Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={order} onValueChange={setOrder}>
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='Order' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='desc'>Newest First</SelectItem>
                <SelectItem value='asc'>Oldest First</SelectItem>
              </SelectContent>
            </Select>
            {/* Date range picker: two DatePickers for start and end */}
            <DatePicker
              value={dateRange.start}
              onChange={(date) => setDateRange((r) => ({ ...r, start: date }))}
              placeholder='Start Date'
              className='w-40'
            />
            <DatePicker
              value={dateRange.end}
              onChange={(date) => setDateRange((r) => ({ ...r, end: date }))}
              placeholder='End Date'
              className='w-40'
            />
          </div>
        </div>
        <hr className='border-gray-200 mb-4' />
        <CourseCard
          courses={courses}
          setShowModal={setShowModal}
          setCourseToEdit={setCourseToEdit}
          setFormData={setFormData}
          loading={isLoading}
        />
      </div>
      {showModal && (
        <AddNewCourse
          open={showModal}
          toggleModal={toggleModal}
          setCourseToEdit={setCourseToEdit}
          courseToEdit={courseToEdit}
          setFormData={setFormData}
          formData={formData}
        />
      )}
    </>
  );
};
