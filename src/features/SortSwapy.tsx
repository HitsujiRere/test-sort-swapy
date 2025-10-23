"use client";

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { createSwapy, type SlotItemMapArray, type Swapy, utils } from "swapy";

type Item = {
  id: string;
  num: number;
};

const randomPoint = () => {
  return Math.floor(Math.random() * 100);
};

const initialItems: Item[] = [
  { id: "1", num: 12 },
  { id: "2", num: 34 },
  { id: "3", num: 56 },
];

export const SortSwapy = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(items, "id")
  );
  const slottedItems = useMemo(
    () => utils.toSlottedItems(items, "id", slotItemMap),
    [items, slotItemMap]
  );

  const swapyRef = useRef<Swapy>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDynamicSwapy = useEffectEvent((items: Item[]) =>
    utils.dynamicSwapy(
      swapyRef.current,
      items,
      "id",
      slotItemMap,
      setSlotItemMap
    )
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: `handleDynamicSwapy` is a effect event
  useEffect(() => handleDynamicSwapy(items), [items]);

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current, {
        manualSwap: true,
      });

      swapyRef.current.onSwap((event) => {
        console.log("swap", event);
        setSlotItemMap(event.newSlotItemMap.asArray);
      });
    }

    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  const handleAppendItem = useCallback(() => {
    setItems((items) => {
      const newItem: Item = { id: `${items.length + 1}`, num: randomPoint() };
      return [...items, newItem];
    });
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      <div className="grid grid-cols-[2fr_1fr] gap-2">
        {slottedItems.map(({ slotId, itemId, item }) => (
          <div
            key={slotId}
            data-swapy-slot={slotId}
            className="rounded border-2 border-slate-400 p-1"
          >
            {item && (
              <div
                key={itemId}
                data-swapy-item={itemId}
                className="grid h-16 items-center justify-center rounded border-2 border-blue-500 bg-blue-400"
              >
                <div className="flex gap-8">
                  <div>#{item.id}</div>
                  <div>{item.num}pt</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="grid h-16 items-center justify-center rounded border-2 border-blue-500"
        onClick={handleAppendItem}
      >
        +
      </button>
    </div>
  );
};
