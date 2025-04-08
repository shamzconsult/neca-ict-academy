import React from "react";
import { FiImage } from "react-icons/fi";

export const AddNewCourse = ({ toggleModal }: { toggleModal: () => void }) => {
  return (
    <div className="fixed lg:sticky h-screen inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[600px]">
        <h2 className="text-xl font-bold mb-4">Add New Course</h2>
        {/* <Toaster /> */}
        <form className="space-y-4 ">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Course Title
            </label>
            <input
              type="text"
              //   onChange={(e) => setName(e.target.value)}
              //   value={name}
              required
              className="w-full p-2 border border-[#C4C4C4] rounded-md"
              placeholder="Software Engineering"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Course Slug
            </label>
            <input
              type="text"
              //   onChange={(e) => setName(e.target.value)}
              //   value={name}
              required
              className="w-full p-2 border border-[#C4C4C4] rounded-md"
              placeholder="software-engineering"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              //   onChange={(e) => setName(e.target.value)}
              //   value={name}
              rows={5}
              required
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
                  name="profileImage"
                  accept="image/*"
                  required
                  className="w-full opacity-0 absolute inset-0 cursor-pointer"
                />
                <span className="text-sm  text-[#aaa4a4] font-semibold ">
                  Choose image file
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Lesson</label>
              <input
                type="text"
                // onChange={(e) => setStartDate(e.target.value)}
                // value={startDate}
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
                // onChange={(e) => setEndDate(e.target.value)}
                // value={endDate}
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
                // onChange={(e) => setStartDate(e.target.value)}
                // value={startDate}
                required
                placeholder="4.0"
                className="w-full p-2 border border-[#C4C4C4] rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Review</label>
              <input
                type="text"
                // onChange={(e) => setEndDate(e.target.value)}
                // value={endDate}
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
              name="Skill Level"
              id="Skill Level"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermidiate">Intermidiate</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-center space-x-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-[#E02B20]  hover:bg-[#e02a20ce] duration-300 text-white w-full rounded-md cursor-pointer"
            >
              Add Course
            </button>
            <button
              className="px-4 py-2 bg-black text-white rounded-md w-full cursor-pointer hover:bg-black/80"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
