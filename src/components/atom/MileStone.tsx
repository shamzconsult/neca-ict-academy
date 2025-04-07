export const MileStone = () => {
  const milestones = [
    { numbers: "15+", label: "Courses" },
    { numbers: "10K+", label: "Successful Program" },
    { numbers: "5K+", label: "Trained Professionals" },
    { numbers: "87+", label: "Tools" },
  ];

  return (
    <section
      className="py-20 my-16 bg-[#27156F] bg-cover bg-center relative animate-bg-move"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dcgghkk7q/image/upload/c_crop,w_1200/v1741252922/Milestone_fill_pebo8m.png')",
      }}
    >
      <div className="relative max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x-4 justify-between items-stretch text-white ">
        {milestones.map((item, index) => (
          <div key={index} className="text-center relative">
            <span className="md:text-[48px] font-bold">{item.numbers}</span>
            <p className="text-sm mt-1 md:text-[18px]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
