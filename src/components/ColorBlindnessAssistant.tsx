import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ColorBlindnessMode = "off" | "protanopia" | "deuteranopia" | "tritanopia";

export function ColorBlindnessAssistant() {
  const [mode, setMode] = useState<ColorBlindnessMode>(() => {
    return (localStorage.getItem("color-blindness-mode") as ColorBlindnessMode) || "off";
  });

  useEffect(() => {
    localStorage.setItem("color-blindness-mode", mode);

    // We clean up any potential legacy style on the root element if it exists
    // from previous implementations or if we switch strategies.
    document.documentElement.style.filter = "none";
  }, [mode]);

  const options = [
    {
      id: "off",
      label: "Off",
      subLabel: "Default colors",
      value: "off" as const,
    },
    {
      id: "protanopia",
      label: "Protanopia",
      subLabel: "Red-blind",
      value: "protanopia" as const,
    },
    {
      id: "deuteranopia",
      label: "Deuteranopia",
      subLabel: "Green-blind",
      value: "deuteranopia" as const,
    },
    {
      id: "tritanopia",
      label: "Tritanopia",
      subLabel: "Blue-blind",
      value: "tritanopia" as const,
    },
  ];

  return (
    <>
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter id="protanopia">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0.000 0 0  0.558 0.442 0.000 0 0  0.000 0.242 0.758 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0.000 0 0  0.700 0.300 0.000 0 0  0.000 0.300 0.700 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix
              type="matrix"
              values="0.950 0.050 0.000 0 0  0.000 0.433 0.567 0 0  0.000 0.475 0.525 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Overlay for simulation */}
      <div
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{
          backdropFilter: mode === 'off' ? 'none' : `url(#${mode})`,
          WebkitBackdropFilter: mode === 'off' ? 'none' : `url(#${mode})`,
        }}
        aria-hidden="true"
      />

      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "fixed bottom-44 right-4 md:bottom-28 md:right-8 z-[101]",
              "w-14 h-14 rounded-full",
              "bg-primary text-primary-foreground",
              "shadow-lg hover:shadow-xl",
              "flex items-center justify-center",
              "transition-all duration-300 hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              mode !== "off" ? "ring-2 ring-primary ring-offset-2" : ""
            )}
            aria-label="Color Blindness Settings"
            title="Color Blindness Simulation"
          >
            <Eye className="w-6 h-6" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 z-[101]" align="end" side="left">
            <div className="grid grid-cols-2 gap-3">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setMode(option.value)}
                  className={cn(
                    "flex flex-col items-start p-3 rounded-xl border transition-all text-left",
                    "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary",
                    mode === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-card-foreground border-border hover:border-primary/50"
                  )}
                >
                  <span className="font-semibold text-sm">{option.label}</span>
                  <span className={cn(
                    "text-xs mt-1",
                    mode === option.value ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {option.subLabel}
                  </span>
                </button>
              ))}
            </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
