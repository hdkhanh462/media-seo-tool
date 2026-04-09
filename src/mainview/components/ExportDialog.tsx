import { DialogWrapper } from "@/components/dialog-wrapper";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import useDebounce from "@/hooks/use-debounce";
import { useCheckFileExists } from "@/hooks/useExportMedia";
import { useSelectFolder } from "@/hooks/useSelectFolder";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/useEditorStore";
import { ExportValues } from "@/types/export.types";
import { getTimeStamp } from "@/utils/datetime";
import { CheckIcon, CopyIcon, FolderOpenIcon, Loader2Icon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

type Props = Omit<React.ComponentProps<typeof DialogWrapper>, "footer"> & {
  form: UseFormReturn<ExportValues>;
  formId: string;
  onSubmit: (data: ExportValues) => void;
};

export const ExportDialog: React.FC<Props> = ({
  form,
  formId,
  onSubmit,
  ...props
}) => {
  const fullPathCopy = useCopyToClipboard();
  const exportType = useEditorStore((state) => state.exportType);
  const selectFolderPath = useEditorStore((state) => state.selectFolderPath);

  const fileName = form.watch("fileName");
  const folderPath = form.watch("folderPath");
  const fullPath = form.watch("fullPath");

  const debouncedFullPath = useDebounce(fullPath, 500);
  const checkFileExists = useCheckFileExists(debouncedFullPath);
  const folderSelect = useSelectFolder({
    onSuccess: (res) => {
      if (res.path) {
        form.setValue("folderPath", res.path);
      }
    },
  });

  const selectFolderName = useMemo(() => {
    return selectFolderPath?.split("\\").pop();
  }, [selectFolderPath]);

  useEffect(() => {
    if (selectFolderName) {
      const timestamp = getTimeStamp();
      form.setValue(
        "fileName",
        `${selectFolderName.trim().replace(" ", "_")}_${timestamp}`,
        { shouldDirty: true },
      );
    }
  }, [form, selectFolderName, exportType]);

  useEffect(() => {
    if (!folderPath || !fileName) return;

    const fullPath = `${folderPath}\\${fileName}.${exportType}`;
    form.setValue("fullPath", fullPath, { shouldDirty: true });
  }, [form, folderPath, fileName, exportType]);

  return (
    <DialogWrapper
      {...props}
      footer={
        <Button
          form={formId}
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2Icon className="animate-spin" />
              Exporting...
            </>
          ) : (
            "Export"
          )}
        </Button>
      }
    >
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Controller
          name="fileName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>File Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter file name..."
              />
              <FieldDescription>
                File name (without extension) will be generated automatically
                based on the folder name and timestamp.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="folderPath"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Folder Path</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter folder path..."
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Select Folder"
                    title="Select Folder"
                    size="icon-xs"
                    onClick={() => folderSelect.mutate()}
                  >
                    <FolderOpenIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Folder path where the file will be exported.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="fullPath"
          control={form.control}
          render={({ field }) => (
            <Field data-invalid={checkFileExists.data}>
              <FieldLabel
                htmlFor={field.name}
                className="flex items-center justify-between"
              >
                <span>Full Path</span>
                {checkFileExists.isFetching && (
                  <Loader2Icon className="size-4 text-primary animate-spin" />
                )}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={checkFileExists.data}
                  placeholder="Full path will be generated automatically..."
                  readOnly
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Copy"
                    title="Copy"
                    size="icon-xs"
                    className={cn(!field.value && "hidden")}
                    onClick={() => fullPathCopy.copy(field.value)}
                  >
                    {fullPathCopy.isCopied ? <CheckIcon /> : <CopyIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Full path where the file will be exported.
              </FieldDescription>
              {checkFileExists.data && (
                <FieldError errors={[{ message: "File already exists" }]} />
              )}
            </Field>
          )}
        />
      </form>
    </DialogWrapper>
  );
};
