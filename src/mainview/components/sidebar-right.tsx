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
import { useEditorStore } from "@/store/useEditorStore";
import type { ExifFormValues } from "@/types/exif.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const DEFAULT_VALUES: ExifFormValues = {
  title: "",
  description: "",
  keywords: [],
  subject: "",
  rating: 0,
  author: "",
  license: "",
};

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const activeTab = useEditorStore((state) => state.activeTab);
  const selectedMedia = useEditorStore((state) => state.selectedMedia);
  const mediaQueue = useEditorStore((state) => state.mediaQueue);
  const setSelectedMedia = useEditorStore((state) => state.setSelectedMedia);
  const addMediaToQueue = useEditorStore((state) => state.addMediaToQueue);
  const updateMediaInQueue = useEditorStore(
    (state) => state.updateMediaInQueue,
  );

  const form = useForm<ExifFormValues>({
    resolver: zodResolver(ExifFormSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...selectedMedia?.exif,
    },
  });

  useEffect(() => {
    if (!selectedMedia) {
      form.reset(DEFAULT_VALUES);
      return;
    }

    if (activeTab === "media") {
      form.reset({
        ...DEFAULT_VALUES,
        ...selectedMedia.exif,
      });
    } else {
      form.reset({
        ...DEFAULT_VALUES,
        ...selectedMedia.exif,
      });
    }
  }, [form, selectedMedia]);

  const isExistInQueue = useMemo(
    () => mediaQueue.some((m) => m.name === selectedMedia?.name),
    [selectedMedia, mediaQueue],
  );

  const handleSubmit = (data: ExifFormValues) => {
    if (!selectedMedia) return;

    const mediaWithExif = { ...selectedMedia, exif: data };

    if (activeTab === "media") {
      if (isExistInQueue) {
        toast.error("Media already exists in queue");
        return;
      }
      addMediaToQueue(mediaWithExif);
    } else {
      if (!isExistInQueue) {
        toast.error("Media not found in queue");
        return;
      }
      updateMediaInQueue(mediaWithExif);
    }
    setSelectedMedia(null);
  };

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-(--header-height) hidden h-[calc(100svh-var(--header-height))]! w-md border-l lg:flex"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border border-b px-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">
            {activeTab === "media" ? "Edit Media Exif" : "Edit Media in Queue"}
          </h2>
          {selectedMedia && <Badge>{selectedMedia.name}</Badge>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ExifForm
          id="exif-form"
          form={form}
          disabled={!selectedMedia}
          onSubmitData={handleSubmit}
        />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="exif-form"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                {activeTab === "media"
                  ? "Adding to Queue..."
                  : "Updating Queue..."}
              </>
            ) : activeTab === "media" ? (
              "Add to Queue"
            ) : (
              "Update Queue"
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
