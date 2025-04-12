import { primaryColor } from "@/constants/design-system";
import BottomNavBar from "../bottom-navbar/bottom-navbar";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: Props) => {
  return (
    <div className="min-h-screen w-full">
      {/* Full width container for mobile/tablet */}
      <div className={`w-full min-h-screen flex flex-col bg-[${primaryColor}]`}>
        <main className={`flex-1 p-4 ${className}`}>{children}</main>
        <BottomNavBar />
      </div>
    </div>
  );
};

export default MainLayout;
