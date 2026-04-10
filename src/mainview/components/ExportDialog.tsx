import { CheckIcon, CopyIcon, FolderOpenIcon, Loader2Icon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
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
import type { ExportValues } from "@/types/import-export.types";
import { getTimeStamp } from "@/utils/datetime";
import { Checkbox } from "./ui/checkbox";

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
  const overwrite = form.watch("overwrite");

  const debouncedFullPath = useDebounce(fullPath, 500);
  const checkFileExists = useCheckFileExists(debouncedFullPath, {
    enable: !overwrite,
  });
  const folderSelect = useSelectFolder({
    onSuccess: (path) => {
      if (path) {
        form.setValue("folderPath", path, { shouldDirty: true });
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
  }, [form, selectFolderName]);

  useEffect(() => {
    if (!folderPath || !fileName) return;

    const fullPath = `${folderPath}\\${fileName}.${exportType}`;
    form.setValue("fullPath", fullPath, { shouldDirty: true });
  }, [form, folderPath, fileName, exportType]);

  const fileExists = overwrite ? false : checkFileExists.data;

  return (
    <DialogWrapper
      {...props}
      footer={
        <Button
          form={formId}
          type="submit"
          disabled={
            form.formState.isSubmitting || !form.formState.isDirty || fileExists
          }
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
            <Field data-invalid={fileExists}>
              <FieldLabel
                htmlFor={field.name}
                className="flex items-center gap-2"
              >
                <span>Full Path</span>
                {checkFileExists.isFetching && (
                  <Loader2Icon className="size-4 animate-spin text-primary" />
                )}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fileExists}
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
              {fileExists && (
                <FieldError errors={[{ message: "File already exists" }]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="overwrite"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <Checkbox
                id={field.name}
                aria-invalid={fieldState.invalid}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldLabel htmlFor={field.name}>
                Overwrite existing file
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
    </DialogWrapper>
  );
};
