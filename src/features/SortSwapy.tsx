"use client";

import { useEffect, useRef } from "react";
import { createSwapy, type Swapy } from "swapy";

export const SortSwapy = () => {
  const swapy = useRef<Swapy | null>(null);
  const container = useRef(null);

  useEffect(() => {
    // If container element is loaded
    if (container.current) {
      swapy.current = createSwapy(container.current);

      // Your event listeners
      swapy.current.onSwap((event) => {
        console.log("swap", event);
      });
    }

    return () => {
      // Destroy the swapy instance on component destroy
      swapy.current?.destroy();
    };
  }, []);

  return (
    <div ref={container} className="flex gap-2">
      <div
        data-swapy-slot="1"
        className="rounded border-4 border-slate-400 p-2"
      >
        <div
          data-swapy-item="1"
          className="grid size-16 items-center justify-center rounded bg-green-400"
        >
          <div>1</div>
        </div>
      </div>

      <div
        data-swapy-slot="2"
        className="rounded border-4 border-slate-400 p-2"
      >
        <div
          data-swapy-item="2"
          className="grid size-16 items-center justify-center rounded bg-blue-400"
        >
          <div>2</div>
        </div>
      </div>
    </div>
  );
};
