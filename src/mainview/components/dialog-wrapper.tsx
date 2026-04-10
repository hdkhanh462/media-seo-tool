import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = React.ComponentProps<typeof Dialog> & {
  title: string;
  description?: string;
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export const DialogWrapper = ({
  title,
  description,
  trigger,
  children,
  footer,
  className,
  ...rest
}: Props) => {
  return (
    <Dialog {...rest}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
