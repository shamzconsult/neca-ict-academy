import React from "react";

export const CohortForm = ({ toggleModal }: { toggleModal: () => void }) => {
  return (
    <div className="fixed lg:sticky h-screen inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px]">
        <h2 className="text-xl font-bold mb-4">Create Cohort</h2>
        <div className="space-y-4 ">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Cohort Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-[#C4C4C4] rounded-md"
              placeholder="Enter cohort name"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-[#C4C4C4] rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-[#C4C4C4] rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-center space-x-2">
            {/* <button
                  className="px-4 py-2 bg-black text-white rounded-md"
                  onClick={toggleModal}
                >
                  Cancel
                </button> */}
            <button
              onClick={toggleModal}
              className="px-4 py-2 bg-[#E02B20] text-white rounded-md cursor-pointer"
            >
              Create Cohort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
