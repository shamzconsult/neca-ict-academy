const EmptyState = ({ title, message }: { title: string; message: string }) => {
  return (
    <div className='h-[70vh] mt-2 flex flex-col justify-center items-center'>
      <h1 className='text-center font-bold'>{title}</h1>
      <p className='text-sm text-slate-400'>{message}</p>
    </div>
  );
};

export default EmptyState;
