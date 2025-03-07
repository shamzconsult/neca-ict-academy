export const MileStone = () => {
  const milestones = [
    { numbers: "15+", label: "Courses" },
    { numbers: "10K+", label: "Successful Program" },
    { numbers: "5K+", label: "Trained Professionals" },
    { numbers: "87+", label: "Tools" },
  ];

  return (
    <section
      className="py-20 my-16 bg-[#27156F] bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dcgghkk7q/image/upload/v1741252922/Milestone_fill_pebo8m.png')",
      }}
    >
      <div className="relative max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x-4 justify-between items-stretch text-white ">
        {milestones.map((item, index) => (
          <div key={index} className="text-center relative">
            <span className="text-3xl font-bold">{item.numbers}</span>
            <p className="text-sm mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
