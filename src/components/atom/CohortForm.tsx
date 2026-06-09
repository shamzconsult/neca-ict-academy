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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePicker } from "../ui/date-picker";
import { parseApiError } from "@/lib/parse-api-error";
import { invalidateAdminDashboardQueries } from "@/hooks/useAdminCohorts";
import {
  FieldError,
  FormErrorBanner,
  fieldErrorClass,
} from "./form/FormFeedback";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CourseType {
  _id: string;
  title: string;
}

type CohortFormData = {
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
  applicationStartDate: string;
  applicationEndDate: string;
  courses: string[];
};

type FieldErrors = Partial<Record<keyof CohortFormData, string>>;

const EMPTY_FORM: CohortFormData = {
  name: "",
  startDate: "",
  endDate: "",
  active: true,
  applicationStartDate: "",
  applicationEndDate: "",
  courses: [],
};

function validateCohortForm(data: CohortFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.name.trim()) {
    errors.name = "Cohort name is required.";
  }

  if (!data.applicationStartDate) {
    errors.applicationStartDate = "Application start date is required.";
  }
  if (!data.applicationEndDate) {
    errors.applicationEndDate = "Application end date is required.";
  }
  if (data.applicationStartDate && data.applicationEndDate) {
    if (
      new Date(data.applicationEndDate) < new Date(data.applicationStartDate)
    ) {
      errors.applicationEndDate =
        "Application end date must be on or after the start date.";
    }
  }

  if (!data.startDate) {
    errors.startDate = "Cohort start date is required.";
  } else if (
    data.applicationEndDate &&
    new Date(data.startDate) <= new Date(data.applicationEndDate)
  ) {
    errors.startDate =
      "Cohort start date must be after the application end date.";
  }

  if (!data.endDate) {
    errors.endDate = "Cohort end date is required.";
  } else if (
    data.startDate &&
    new Date(data.endDate) <= new Date(data.startDate)
  ) {
    errors.endDate = "Cohort end date must be after the cohort start date.";
  }

  return errors;
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
  const [formData, setFormData] = useState<CohortFormData>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState("");

  const { data: allCourses = [], isError: coursesLoadError } = useQuery<
    CourseType[]
  >({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      return res.json();
    },
  });

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setFieldErrors({});
    setApiError("");
    setSearch("");
  };

  const clearFieldError = (field: keyof CohortFormData) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setApiError("");
  };

  const createCohort = useMutation({
    mutationFn: async (payload: CohortFormData) => {
      const res = await fetch("/api/cohorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Failed to create cohort"));
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      invalidateAdminDashboardQueries(queryClient);
      setCohortsData((prev) => [...prev, data.newCohort]);
      toast.success("Cohort created successfully");
      resetForm();
      toggleModal();
    },
    onError: (error: Error) => {
      const message = error.message || "Failed to create cohort";
      setApiError(message);
      toast.error(message);
    },
  });

  const updateCohort = useMutation({
    mutationFn: async ({
      slug,
      payload,
    }: {
      slug: string;
      payload: CohortFormData;
    }) => {
      const formDataToSend = new FormData();
      formDataToSend.append("name", payload.name);
      formDataToSend.append("startDate", payload.startDate);
      formDataToSend.append("endDate", payload.endDate);
      formDataToSend.append(
        "applicationStartDate",
        payload.applicationStartDate,
      );
      formDataToSend.append("applicationEndDate", payload.applicationEndDate);
      formDataToSend.append("active", payload.active.toString());
      formDataToSend.append("courses", JSON.stringify(payload.courses));

      const res = await fetch(`/api/cohorts/${slug}`, {
        method: "PUT",
        body: formDataToSend,
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, "Failed to update cohort"));
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      queryClient.invalidateQueries({ queryKey: ["cohort-stats"] });
      invalidateAdminDashboardQueries(queryClient);

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
        }),
      );

      toast.success("Cohort updated successfully");
      setCohortToEdit?.(null);
      resetForm();
      toggleModal();
    },
    onError: (error: Error) => {
      const message = error.message || "Failed to update cohort";
      setApiError(message);
      toast.error(message);
    },
  });

  const isSubmitting = createCohort.isPending || updateCohort.isPending;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name as keyof CohortFormData);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    const errors = validateCohortForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please fix the errors below before submitting.");
      return;
    }

    setFieldErrors({});
    if (cohortToEdit) {
      updateCohort.mutate({ slug: cohortToEdit.slug, payload: formData });
    } else {
      createCohort.mutate(formData);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    toggleModal();
    setCohortToEdit?.(null);
    resetForm();
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
      setFieldErrors({});
      setApiError("");
    }
  }, [cohortToEdit]);

  return (
    <Dialog open onOpenChange={(openState) => !openState && handleClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {cohortToEdit ? "Update Cohort" : "Create Cohort"}
          </DialogTitle>
          <p className='text-sm text-muted-foreground'>
            {cohortToEdit
              ? "Edit cohort details and linked courses."
              : "Set up a new cohort with application and schedule dates."}
          </p>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className='space-y-5' noValidate>
          <FormErrorBanner
            message={apiError}
            onDismiss={() => setApiError("")}
          />

          <div className='space-y-2'>
            <Label htmlFor='name'>
              Cohort Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='e.g. AI & 3D Animation — Cohort 3'
              aria-invalid={!!fieldErrors.name}
              className={fieldErrorClass(!!fieldErrors.name)}
            />
            <FieldError message={fieldErrors.name} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='active'>Status</Label>
            <Select
              value={formData.active ? "true" : "false"}
              onValueChange={(val) => {
                setFormData((prev) => ({ ...prev, active: val === "true" }));
                setApiError("");
              }}
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

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label>
                Application Start <span className='text-red-500'>*</span>
              </Label>
              <DatePicker
                value={
                  formData.applicationStartDate
                    ? new Date(formData.applicationStartDate)
                    : undefined
                }
                onChange={(date: Date | undefined) => {
                  setFormData((prev) => ({
                    ...prev,
                    applicationStartDate: date
                      ? format(date, "yyyy-MM-dd")
                      : "",
                  }));
                  clearFieldError("applicationStartDate");
                }}
                placeholder='Pick a date'
                className={cn(
                  "w-full",
                  fieldErrorClass(!!fieldErrors.applicationStartDate),
                )}
              />
              <FieldError message={fieldErrors.applicationStartDate} />
            </div>
            <div className='space-y-2'>
              <Label>
                Application End <span className='text-red-500'>*</span>
              </Label>
              <DatePicker
                value={
                  formData.applicationEndDate
                    ? new Date(formData.applicationEndDate)
                    : undefined
                }
                onChange={(date: Date | undefined) => {
                  setFormData((prev) => ({
                    ...prev,
                    applicationEndDate: date ? format(date, "yyyy-MM-dd") : "",
                  }));
                  clearFieldError("applicationEndDate");
                }}
                placeholder='Pick a date'
                className={cn(
                  "w-full",
                  fieldErrorClass(!!fieldErrors.applicationEndDate),
                )}
              />
              <FieldError message={fieldErrors.applicationEndDate} />
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label>
                Cohort Start <span className='text-red-500'>*</span>
              </Label>
              <DatePicker
                value={
                  formData.startDate ? new Date(formData.startDate) : undefined
                }
                onChange={(date: Date | undefined) => {
                  setFormData((prev) => ({
                    ...prev,
                    startDate: date ? format(date, "yyyy-MM-dd") : "",
                  }));
                  clearFieldError("startDate");
                }}
                placeholder='Pick a date'
                className={cn(
                  "w-full",
                  fieldErrorClass(!!fieldErrors.startDate),
                )}
              />
              <FieldError message={fieldErrors.startDate} />
            </div>
            <div className='space-y-2'>
              <Label>
                Cohort End <span className='text-red-500'>*</span>
              </Label>
              <DatePicker
                value={
                  formData.endDate ? new Date(formData.endDate) : undefined
                }
                onChange={(date: Date | undefined) => {
                  setFormData((prev) => ({
                    ...prev,
                    endDate: date ? format(date, "yyyy-MM-dd") : "",
                  }));
                  clearFieldError("endDate");
                }}
                placeholder='Pick a date'
                className={cn("w-full", fieldErrorClass(!!fieldErrors.endDate))}
              />
              <FieldError message={fieldErrors.endDate} />
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Courses</Label>
            <Input
              type='text'
              placeholder='Search courses...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className='max-h-48 overflow-y-auto rounded-lg border border-[#27156F]/10 bg-gray-50/50 p-3'>
              {coursesLoadError ? (
                <p className='text-sm text-red-600'>
                  Failed to load courses. Please refresh and try again.
                </p>
              ) : allCourses.length === 0 ? (
                <p className='text-sm text-gray-500'>
                  No courses available yet.
                </p>
              ) : (
                allCourses
                  .filter((course) =>
                    course.title.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((course) => (
                    <label
                      key={course._id}
                      className='flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 hover:bg-white'
                    >
                      <input
                        type='checkbox'
                        checked={formData.courses.includes(course._id)}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            courses: e.target.checked
                              ? [...prev.courses, course._id]
                              : prev.courses.filter((id) => id !== course._id),
                          }));
                          setApiError("");
                        }}
                        className='rounded border-gray-300'
                      />
                      <span className='text-sm'>{course.title}</span>
                    </label>
                  ))
              )}
            </div>
            {formData.courses.length > 0 && (
              <p className='text-xs text-gray-500'>
                {formData.courses.length} course
                {formData.courses.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          <DialogFooter className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
            <Button
              variant='outline'
              type='button'
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
              ) : cohortToEdit ? (
                "Update Cohort"
              ) : (
                "Create Cohort"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
