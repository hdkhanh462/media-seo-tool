import { type ActiveContent, useAppStore } from "@/store/useAppStore";

type Props = React.PropsWithChildren<{
  value: ActiveContent;
}>;

export const AppContent = ({ value, children }: Props) => {
  const activeContent = useAppStore((state) => state.activeContent);
  const isActive = value ? activeContent === value : true;

  if (!isActive) return null;
  return children;
};
