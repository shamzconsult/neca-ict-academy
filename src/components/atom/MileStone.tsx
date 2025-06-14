export const MileStone = () => {
  const milestones = [
    { numbers: "5+", label: "Courses" },
    { numbers: "10+", label: "Successful Programs" },
    { numbers: "500+", label: "Trained Professionals" },
    { numbers: "400+", label: "Graduates" },
  ];

  return (
    <section
      className='py-20 my-16 bg-[#27156F] bg-cover bg-center relative animate-bg-move '
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dcgghkk7q/image/upload/c_crop,w_1200/v1741252922/Milestone_fill_pebo8m.png')",
      }}
    >
      <div className='bg-ellipse top-48 h-[125px] w-[90%] rounded-[100%] left-30 max-sm:hidden' />
      <div className='relative max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x-4 justify-between items-stretch text-white '>
        {milestones.map((item, index) => (
          <div key={index} className='text-center relative'>
            <span className='md:text-[48px] font-bold'>{item.numbers}</span>
            <p className='text-sm mt-1 md:text-[18px]'>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
