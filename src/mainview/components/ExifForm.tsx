import { RefreshCcwIcon, StarIcon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Rating, RatingItem } from "@/components/ui/rating";
import {
  TagsInput,
  TagsInputClear,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
} from "@/components/ui/tags-input";
import { Textarea } from "@/components/ui/textarea";
import type { ExifFormValues } from "@/types/exif.types";

type Props = {
  id?: string;
  form: UseFormReturn<ExifFormValues>;
  disabled?: boolean;
  onSubmitData?: (data: ExifFormValues) => void;
};

export const ExifForm: React.FC<Props> = ({
  id,
  form,
  disabled,
  onSubmitData,
}) => {
  function onSubmit(data: ExifFormValues) {
    onSubmitData?.(data);
  }

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-full space-y-4 p-4"
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Title (Title/Headline)</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Enter title..."
              disabled={disabled}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="grid grid-cols-6 gap-4">
        <Controller
          name="author"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-4">
              <FieldLabel htmlFor={field.name}>Author</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter author..."
                disabled={disabled}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="rating"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-2">
              <FieldLabel htmlFor={field.name}>Rating</FieldLabel>
              <Rating
                value={field.value}
                onValueChange={field.onChange}
                className="h-9 gap-1 text-yellow-500"
                disabled={disabled}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <RatingItem key={i}>
                    <StarIcon />
                  </RatingItem>
                ))}
              </Rating>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="keywords"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="tags-input-keywords">Keywords</FieldLabel>
            <TagsInput
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
              editable
              addOnPaste
            >
              <InputGroup className="h-auto min-h-10 has-[[data-slot=tags-input-input]:focus-visible]:border-ring has-[[data-slot=tags-input-input]:focus-visible]:ring-3 has-[[data-slot=tags-input-input]:focus-visible]:ring-ring/50">
                <TagsInputList className="border-none bg-transparent ring-0 focus-within:ring-0">
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
                <InputGroupAddon align="inline-end">
                  <TagsInputClear asChild>
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Clear keywords"
                    >
                      <RefreshCcwIcon />
                    </InputGroupButton>
                  </TagsInputClear>
                </InputGroupAddon>
              </InputGroup>
            </TagsInput>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="subjects"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="tags-input-subjects">
              Subjects (Subjects/Categories)
            </FieldLabel>
            <TagsInput
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
              editable
              addOnPaste
            >
              <InputGroup className="h-auto min-h-10 has-[[data-slot=tags-input-input]:focus-visible]:border-ring has-[[data-slot=tags-input-input]:focus-visible]:ring-3 has-[[data-slot=tags-input-input]:focus-visible]:ring-ring/50">
                <TagsInputList className="border-none bg-transparent ring-0 focus-within:ring-0">
                  {field.value?.map((keyword) => (
                    <TagsInputItem key={keyword} value={keyword}>
                      {keyword}
                    </TagsInputItem>
                  ))}
                  <TagsInputInput
                    id="tags-input-subjects"
                    placeholder="Add subject..."
                    aria-invalid={fieldState.invalid}
                  />
                </TagsInputList>
                <InputGroupAddon align="inline-end">
                  <TagsInputClear asChild>
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Clear subjects"
                    >
                      <RefreshCcwIcon />
                    </InputGroupButton>
                  </TagsInputClear>
                </InputGroupAddon>
              </InputGroup>
            </TagsInput>
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
              placeholder="Enter description..."
              disabled={disabled}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="comment"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Comment</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Enter comment..."
              disabled={disabled}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
};
