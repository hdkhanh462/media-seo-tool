import { useState } from "react";

export const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const onChange = (open: boolean) => setIsOpen(open);

  return { isOpen, open, close, onChange };
};
