"use client";

import { CohortForm } from "@/components/atom/CohortForm";
import CohortTable from "@/components/atom/Table/CohortTable";
import EmptyState from "@/components/atom/EmptyState";
import { PageLoader } from "@/components/atom/PageLoader";
import { cohortTableHead } from "@/const";
import { CohortType } from "@/types";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, PlusCircle, SquareLibrary } from "lucide-react";
import { AdminSectionHeader } from "@/components/atom/AdminSectionHeader";
import {
  useAdminCohorts,
  useSetAdminCohortsCache,
} from "@/hooks/useAdminCohorts";

export const Cohorts = () => {
  const [showModal, setShowModal] = useState(false);
  const setCohortsData = useSetAdminCohortsCache();
  const { data: cohortsData = [], isPending } = useAdminCohorts();
  const [cohortToEdit, setCohortToEdit] = useState<CohortType | null>(null);
  const [, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    applicationStartDate: "",
    applicationEndDate: "",
  });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const checkAllCohortStatus = () => {
    setShowModal(!showModal);
  };

  const handleEdit = (cohort: CohortType, event: React.MouseEvent) => {
    event.stopPropagation();
    if (setCohortToEdit && setFormData && setShowModal) {
      setCohortToEdit(cohort);
      setFormData({
        name: cohort.name,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        applicationStartDate: cohort.applicationStartDate,
        applicationEndDate: cohort.applicationEndDate,
      });
      setShowModal(true);
    }
  };

  if (isPending) {
    return <PageLoader className='bg-gray-50' />;
  }

  return (
    <>
      <AdminSectionHeader
        title='Cohorts'
        icon={SquareLibrary}
        cta={
          <>
            <Button
              onClick={checkAllCohortStatus}
              className='gap-2 bg-[#27156F] text-white hover:bg-[#27156F]/90'
            >
              <PlusCircle className='size-4' />
              Create Cohort
            </Button>

            <Button
              variant='outline'
              asChild
              className='gap-2 border-[#27156F]/20'
            >
              <Link href='/enroll' target='_blank'>
                <ExternalLink className='size-4' />
                Go to Enroll Portal
              </Link>
            </Button>
          </>
        }
      />
      {cohortsData.length > 0 ? (
        <CohortTable
          tableHead={cohortTableHead}
          handleEdit={handleEdit}
          tableData={cohortsData}
          action={true}
        />
      ) : (
        <EmptyState
          title='No Cohort Created yet'
          message='Click on the create Cohort button to start'
        />
      )}
      {showModal && (
        <CohortForm
          toggleModal={toggleModal}
          setCohortsData={setCohortsData}
          cohortToEdit={cohortToEdit}
          setCohortToEdit={setCohortToEdit}
        />
      )}
    </>
  );
};
