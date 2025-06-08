import { CohortType } from "@/types";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "../ui/date-picker";

interface CourseType {
  _id: string;
  title: string;
}

export const CohortForm = ({
  toggleModal,
  setCohortsData,
  cohortToEdit,
  setCohortToEdit,
}: {
  toggleModal: () => void;
  cohortToEdit?: CohortType | null;
  setCohortsData: Dispatch<SetStateAction<CohortType[]>>;
  setCohortToEdit?: (cohort: CohortType | null) => void;
}) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // Fetch courses
  const { data: allCourses = [] } = useQuery<CourseType[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      return res.json();
    },
  });

  // Create cohort mutation
  const createCohort = useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch("/api/cohorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create cohort");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      setCohortsData((prev) => [...prev, data.newCohort]);
      toast.success("Cohort Created Successfully 🎉🎉");
      toggleModal();
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create cohort");
      console.error("Error creating cohort:", error);
    },
  });

  // Update cohort mutation
  const updateCohort = useMutation({
    mutationFn: async ({ slug, formData }: { slug: string; formData: any }) => {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append(
        "applicationStartDate",
        formData.applicationStartDate
      );
      formDataToSend.append("applicationEndDate", formData.applicationEndDate);
      formDataToSend.append("active", formData.active.toString());
      formDataToSend.append("courses", JSON.stringify(formData.courses));

      const res = await fetch(`/api/cohorts/${slug}`, {
        method: "PUT",
        body: formDataToSend,
      });
      if (!res.ok) throw new Error("Failed to update cohort");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      queryClient.invalidateQueries({ queryKey: ["cohort-stats"] });

      setCohortsData((prev) =>
        prev.map((cohort) => {
          if (cohort.slug === cohortToEdit?.slug) {
            return {
              ...data.updatedCohort,
              applicantCount: cohort.applicantCount,
              admitted: cohort.admitted,
              graduated: cohort.graduated,
              declined: cohort.declined,
            };
          }
          return cohort;
        })
      );

      toast.success("Cohort Updated Successfully 🎉");
      setCohortToEdit?.(null);
      resetForm();
      toggleModal();
    },
    onError: (error) => {
      toast.error("Failed to update cohort");
      console.error("Error updating cohort:", error);
    },
  });

  const [formData, setFormData] = useState<{
    name: string;
    startDate: string;
    endDate: string;
    active: boolean;
    applicationStartDate: string;
    applicationEndDate: string;
    courses: string[];
  }>({
    name: "",
    startDate: "",
    endDate: "",
    active: true,
    applicationStartDate: "",
    applicationEndDate: "",
    courses: [],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      active: true,
      applicationStartDate: "",
      applicationEndDate: "",
      courses: [],
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCohort.mutate(formData);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cohortToEdit) return;
    updateCohort.mutate({ slug: cohortToEdit.slug, formData });
  };

  useEffect(() => {
    if (cohortToEdit) {
      setFormData({
        name: cohortToEdit.name,
        startDate: cohortToEdit.startDate,
        endDate: cohortToEdit.endDate,
        active: cohortToEdit.active,
        applicationStartDate: cohortToEdit.applicationStartDate,
        applicationEndDate: cohortToEdit.applicationEndDate,
        courses: cohortToEdit.courses || [],
      });
    }
  }, [cohortToEdit]);

  return (
    <Dialog
      open
      onOpenChange={(openState) => {
        if (!openState) {
          toggleModal();
        }
      }}
    >
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {cohortToEdit ? "Updating Cohort" : "Create Cohort"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={cohortToEdit ? handleUpdate : handleSubmit}
          className='space-y-6'
        >
          <div className='space-y-2'>
            <Label htmlFor='name'>Cohort Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              placeholder='Enter cohort name'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='active'>Status</Label>
            <Select
              value={formData.active ? "true" : "false"}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, active: val === "true" }))
              }
              name='active'
              required
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>Active</SelectItem>
                <SelectItem value='false'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 space-y-2'>
              <Label>Application Start Date</Label>
              <DatePicker
                value={
                  formData.applicationStartDate
                    ? new Date(formData.applicationStartDate)
                    : undefined
                }
                onChange={(date: Date | undefined) =>
                  setFormData((prev) => ({
                    ...prev,
                    applicationStartDate: date
                      ? format(date, "yyyy-MM-dd")
                      : "",
                  }))
                }
                placeholder='Pick a date'
                className='w-full'
              />
            </div>
            <div className='flex-1 space-y-2'>
              <Label>Application End Date</Label>
              <DatePicker
                value={
                  formData.applicationEndDate
                    ? new Date(formData.applicationEndDate)
                    : undefined
                }
                onChange={(date: Date | undefined) => {
                  if (date && formData.applicationStartDate) {
                    const startDate = new Date(formData.applicationStartDate);
                    if (date < startDate) {
                      toast.error(
                        "Application end date must be after start date"
                      );
                      return;
                    }
                  }
                  setFormData((prev) => ({
                    ...prev,
                    applicationEndDate: date ? format(date, "yyyy-MM-dd") : "",
                  }));
                }}
                placeholder='Pick a date'
                className='w-full'
              />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 space-y-2'>
              <Label>Cohort Start Date</Label>
              <DatePicker
                value={
                  formData.startDate ? new Date(formData.startDate) : undefined
                }
                onChange={(date: Date | undefined) => {
                  if (date && formData.applicationEndDate) {
                    const appEndDate = new Date(formData.applicationEndDate);
                    if (date <= appEndDate) {
                      toast.error(
                        "Cohort start date must be after application end date"
                      );
                      return;
                    }
                  }
                  setFormData((prev) => ({
                    ...prev,
                    startDate: date ? format(date, "yyyy-MM-dd") : "",
                  }));
                }}
                placeholder='Pick a date'
                className='w-full'
              />
            </div>
            <div className='flex-1 space-y-2'>
              <Label>Cohort End Date</Label>
              <DatePicker
                value={
                  formData.endDate ? new Date(formData.endDate) : undefined
                }
                onChange={(date: Date | undefined) => {
                  if (date && formData.startDate) {
                    const startDate = new Date(formData.startDate);
                    if (date <= startDate) {
                      toast.error("Cohort end date must be after start date");
                      return;
                    }
                  }
                  setFormData((prev) => ({
                    ...prev,
                    endDate: date ? format(date, "yyyy-MM-dd") : "",
                  }));
                }}
                placeholder='Pick a date'
                className='w-full'
              />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 space-y-2'>
              <Label>Courses</Label>
              <Input
                type='text'
                placeholder='Search courses...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='mb-2'
              />
              <div className='border rounded p-2 h-48 overflow-y-auto bg-white'>
                {allCourses
                  .filter((course: CourseType) =>
                    course.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((course: CourseType) => (
                    <label
                      key={course._id}
                      className='flex items-center gap-2 py-1 cursor-pointer'
                    >
                      <input
                        type='checkbox'
                        checked={formData.courses.includes(course._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              courses: [...prev.courses, course._id],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              courses: prev.courses.filter(
                                (id) => id !== course._id
                              ),
                            }));
                          }
                        }}
                      />
                      <span>{course.title}</span>
                    </label>
                  ))}
                {allCourses.length === 0 && (
                  <span className='text-gray-400'>No courses available</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className='w-full flex flex-col md:flex-row gap-2 mt-6'>
            <Button
              type='submit'
              disabled={createCohort.isPending || updateCohort.isPending}
              className='w-full md:w-auto'
            >
              {createCohort.isPending || updateCohort.isPending
                ? "Loading..."
                : cohortToEdit
                  ? "Update Cohort"
                  : "Create Cohort"}
            </Button>
            <Button
              variant='destructive'
              type='button'
              onClick={() => {
                toggleModal();
                setCohortToEdit?.(null);
                resetForm();
              }}
              className='w-full md:w-auto'
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
