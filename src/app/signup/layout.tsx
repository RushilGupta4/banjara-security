const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='py-12 max-w-[120ch] mx-auto'>
      <div className='mx-8 md:mx-16'>{children}</div>
    </div>
  );
};

export default BaseLayout;
