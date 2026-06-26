const HomeCurriculum = () => {
  return (
    <div className='flex flex-col bg-slate-700 p-6 border-l text-white md:flex-row items-start'>
      <div className='flex flex-col gap-3 w-full'>
        <h2 className='text-xl md:text-3xl text-center xl:text-start font-semibold'>Work with us</h2>
        <h2 className='text-sm md:text-md text-center xl:text-start xl:text-2xl font-light'>We are a market leader and we are looking for people to work with us.</h2>
        <a href="/formCv" className="group w-fit hover:text-[#6333c7] text-white underline font-bold transition-all duration-300 transform active:scale-95">Upload your cv here</a>
      </div>
    </div>
  )
}
export default HomeCurriculum