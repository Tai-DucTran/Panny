import TopNav from "../top_navbar/top_navbar";

interface Props {
  children: React.ReactNode;
  className?: string;
}
  
const MainLayout = ({ children, className }: Props) => {
  return (
    <div className="min-h-screen flex justify-center">
      {/* This creates a responsive container that's fullscreen on mobile/tablet */}
      <div className="w-full max-w-[768px] bg-white min-h-screen shadow-lg flex flex-col bg-[oklch(95%_0.052_163.051)] md:shadow-lg sm:w-full md:w-full">
        <div className="px-4 sm:px-6 md:px-20 pt-6">
          <TopNav title={'Your Garden'} />
        </div>
        <main className={`flex-1 p-4 ${className}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;