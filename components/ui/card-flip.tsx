"use client";
import React, { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardFlipContextType {
  isFlipped: boolean;
  flip: () => void;
  flipBack: () => void;
}

const CardFlipContext = createContext<CardFlipContextType | null>(null);

export function useCardFlip() {
  const context = useContext(CardFlipContext);
  if (!context) {
    throw new Error("useCardFlip must be used within CardFlip");
  }
  return context;
}

function CardFlip({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: [React.ReactNode, React.ReactNode];
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [front, back] = React.Children.toArray(children);

  const flip = () => setIsFlipped(true);
  const flipBack = () => setIsFlipped(false);

  return (
    <CardFlipContext.Provider value={{ isFlipped, flip, flipBack }}>
      <div
        className={cn("relative w-full", className)}
        style={{ perspective: "1000px" }}
        {...props}
      >
        <motion.div
          className="relative w-full"
          initial={false}
          animate={{ rotateY: isFlipped ? -180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div 
            className="w-full" 
            style={{ 
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transformStyle: "preserve-3d"
            }}
          >
            <div className="relative w-full">
              {front}
            </div>
          </div>

          <div
            className="absolute inset-0 w-full"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(-180deg)",
              transformStyle: "preserve-3d"
            }}
          >
            <div className="relative w-full h-full">
              {back}
            </div>
          </div>
        </motion.div>
      </div>
    </CardFlipContext.Provider>
  );
}

function CardFlipFront({ className, ...props }: React.ComponentProps<"div">) {
  const context = useContext(CardFlipContext);
  if (!context) {
    throw new Error("CardFlipFront must be used within CardFlip");
  }

  return (
    <div
      data-slot="card"
      onClick={context.flip}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

function CardFlipBack({ className, ...props }: React.ComponentProps<"div">) {
  const context = useContext(CardFlipContext);
  if (!context) {
    throw new Error("CardFlipBack must be used within CardFlip");
  }

  return (
    <div
      data-slot="card"
      onClick={context.flipBack}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

function CardFlipHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardFlipTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardFlipDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardFlipAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardFlipContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFlipFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  CardFlip,
  CardFlipFront,
  CardFlipBack,
  CardFlipHeader,
  CardFlipFooter,
  CardFlipTitle,
  CardFlipAction,
  CardFlipDescription,
  CardFlipContent,
};