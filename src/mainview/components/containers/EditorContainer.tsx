import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TagsInput,
  TagsInputClear,
  TagsInputInput,
  TagsInputItem,
  TagsInputLabel,
  TagsInputList,
} from "@/components/ui/tags-input";

export const EditorContainer = () => {
  const [tricks, setTricks] = useState(["Kickflip", "Heelflip", "FS 540"]);
  return (
    <div>
      EditorContainer
      <TagsInput value={tricks} onValueChange={setTricks} editable addOnPaste>
        <TagsInputLabel>Tricks</TagsInputLabel>
        <TagsInputList>
          {tricks.map((trick) => (
            <TagsInputItem key={trick} value={trick}>
              {trick}
            </TagsInputItem>
          ))}
          <TagsInputInput placeholder="Add trick..." />
        </TagsInputList>
        <TagsInputClear asChild>
          <Button variant="outline">
            <RefreshCcw className="h-4 w-4" />
            Clear
          </Button>
        </TagsInputClear>
      </TagsInput>
    </div>
  );
};
