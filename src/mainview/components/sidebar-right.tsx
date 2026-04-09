import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import type * as React from "react";
import { useForm } from "react-hook-form";

import { ExifForm } from "@/components/ExifForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ExifFormSchema } from "@/schemas/exif.schema";
import { useAppStore } from "@/store/useAppStore";
import type { ExifFormValues } from "@/types/exif.types";

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const selectedMedia = useAppStore((state) => state.selectedMedia);

  const form = useForm<ExifFormValues>({
    resolver: zodResolver(ExifFormSchema),
    defaultValues: {
      title: "",
      description: "",
      keywords: [],
      subject: "",
      rating: 0,
      author: "",
      license: "",
      ...selectedMedia?.exif,
    },
  });

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-(--header-height) hidden h-[calc(100svh-var(--header-height))]! w-md border-l lg:flex"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border border-b px-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Edit Exif</h2>
          {selectedMedia && (
            <Badge variant="secondary">{selectedMedia.name}</Badge>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ExifForm form={form} />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
