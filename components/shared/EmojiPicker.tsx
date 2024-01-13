"use client";

import React from "react";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type EmojiPickerProps = {
  onChange: (emoji: string) => void;
};

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile
          className={cn(
            "text-zinc-500 dark:text-zinc-400",
            "hover:text-zinc-600 dark:hover:text-zinc-300 transition",
            "cursor-pointer",
          )}
        />
      </PopoverTrigger>
      <PopoverContent
        side={"right"}
        sideOffset={40}
        className={cn(
          "bg-transparent border-none shadow-none",
          "drop-shadow-none mb-16",
        )}
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji: { native: string }) => {
            onChange(emoji.native);
          }}
          theme={resolvedTheme}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
