import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import {
  TagsInput,
  TagsInputClear,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
} from "@/components/ui/tags-input";
import { Textarea } from "@/components/ui/textarea";
import { exifFormSchema } from "@/schemas/exif.schema";
import type { ExifFormValues } from "@/types/exif.types";

export const ExifForm = ({
  defaultValues,
  onSubmitData,
}: {
  defaultValues?: Partial<ExifFormValues>;
  onSubmitData?: (data: ExifFormValues) => void;
}) => {
  const form = useForm<ExifFormValues>({
    resolver: zodResolver(exifFormSchema),
    defaultValues: {
      title: "",
      description: "",
      keywords: [],
      rating: 0,
      author: "",
      license: "",
      ...defaultValues,
    },
  });

  function onSubmit(data: ExifFormValues) {
    onSubmitData?.(data);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl"
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Title"
            />
            <FieldDescription>Document title.</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Description"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="keywords"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <TagsInput
              value={field.value}
              onValueChange={field.onChange}
              editable
              addOnPaste
            >
              <FieldLabel htmlFor="tags-input-keywords">Keywords</FieldLabel>
              <TagsInputList>
                {field.value?.map((keyword) => (
                  <TagsInputItem key={keyword} value={keyword}>
                    {keyword}
                  </TagsInputItem>
                ))}
                <TagsInputInput
                  id="tags-input-keywords"
                  placeholder="Add keyword..."
                  aria-invalid={fieldState.invalid}
                />
              </TagsInputList>
              <TagsInputClear asChild>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="mt-2"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </TagsInputClear>
            </TagsInput>
            <FieldDescription>
              Keywords related to the document.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="rating"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Rating (0-5)</FieldLabel>
            <NumberInput {...field} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="author"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Author</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Author name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="license"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>License</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="License (e.g., Copyright)"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};
