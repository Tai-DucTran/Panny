import router from "next/router";
import { BackButton, Title, CustomAppBar } from "./index.sc";
import { ReactNode } from "react";

type AppBarProps = {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightSlot?: ReactNode;
};

export const AppBar = ({
  title = "",
  onBack,
  showBackButton = true,
  rightSlot,
}: AppBarProps) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <CustomAppBar>
      {showBackButton && (
        <BackButton onClick={handleBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </BackButton>
      )}
      <Title>{title}</Title>
      {rightSlot}
    </CustomAppBar>
  );
};
