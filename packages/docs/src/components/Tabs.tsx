"use client";
import React, { useState } from "react";
import { Marker } from "@coord/graph";
export function Tabs<
  T extends {
    [key: string]: React.JSX.Element;
  }
>({
  tabs,
  openTab,
  preferenceKey,
}: {
  tabs: T;
  openTab?: keyof T & string;
  preferenceKey?: string;
}) {
  const preferenceLocalStorageKey = `preferred-tab:${preferenceKey}`;
  const [tab, setTab] = React.useState(
    openTab || (Object.keys(tabs)[0] as keyof T & string)
  );
  React.useEffect(() => {
    if (!preferenceKey) return;

    const storedTab = localStorage.getItem(preferenceLocalStorageKey);
    if (storedTab && storedTab in tabs) setTab(storedTab);
  }, [preferenceKey]);

  React.useEffect(() => {
    if (!preferenceKey) return;
    localStorage.setItem(preferenceLocalStorageKey, tab);
  }, [preferenceKey, tab]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row flex-wrap gap-2 font-mono">
        {Object.keys(tabs).map((key) => (
          <button
            key={key}
            className={`whitespace-nowrap rounded-sm p-1 text-xs font-bold ${
              tab === key
                ? "bg-dark-100 text-dark-900"
                : "bg-dark-900/30 text-dark-100"
            }`}
            onClick={() => setTab(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">{tabs[tab]}</div>
    </div>
  );
}
