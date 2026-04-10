import { FolderOpenIcon, Loader2Icon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { DialogWrapper } from "@/components/dialog-wrapper";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSelectFile } from "@/hooks/useSelectExcel";
import { useEditorStore } from "@/store/useEditorStore";
import type { ImportValues } from "@/types/import-export.types";

type Props = Omit<React.ComponentProps<typeof DialogWrapper>, "footer"> & {
  form: UseFormReturn<ImportValues>;
  formId: string;
  onSubmit: (data: ImportValues) => void;
};

export const ImportDialog: React.FC<Props> = ({
  form,
  formId,
  onSubmit,
  ...props
}) => {
  const exportType = useEditorStore((state) => state.exportType);
  const folderSelect = useSelectFile({
    onSuccess: (path) => {
      if (path) {
        form.setValue("fullPath", path, { shouldDirty: true });
      }
    },
  });

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
              Importing...
            </>
          ) : (
            "Import"
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
          name="fullPath"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Full Path</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Select a file to import..."
                  readOnly
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Select file"
                    title="Select file"
                    size="icon-xs"
                    onClick={() => folderSelect.mutate(exportType)}
                  >
                    <FolderOpenIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Full path where the file will be imported.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
    </DialogWrapper>
  );
};
