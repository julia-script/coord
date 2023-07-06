function Pallete({
  className,
}: {
  className: string[];
}) {
  return (
    <div>
      <h2>{className[0]?.split("-")[1]}</h2>
      <div className="flex gap-2">
        {className.map((w, i) => (
          <div
            key={i}
            className={`flex w-full flex-col items-center`}
          >
            <div
              className={`aspect-square w-full rounded-md ${w}`}
            />
            <span
              className={`py-2 font-mono text-xs text-gray-500 dark:text-gray-400`}
            >
              {parseInt(w.split("-")[2]) ||
                "default"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <div className="prose prose-invert mx-auto my-5">
      <h1>Styles</h1>
      <Pallete
        className={[
          "bg-dark",
          "bg-dark-50",
          "bg-dark-100",
          "bg-dark-200",
          "bg-dark-300",
          "bg-dark-400",
          "bg-dark-500",
          "bg-dark-600",
          "bg-dark-700",
          "bg-dark-750",
          "bg-dark-800",
          "bg-dark-900",
        ]}
      />
      <Pallete
        className={[
          "bg-graph",
          "bg-graph-50",
          "bg-graph-100",
          "bg-graph-200",
          "bg-graph-300",
          "bg-graph-400",
          "bg-graph-500",
          "bg-graph-600",
          "bg-graph-700",
          "bg-graph-750",
          "bg-graph-800",
          "bg-graph-900",
        ]}
      />
      <Pallete
        className={[
          "bg-motion",
          "bg-motion-50",
          "bg-motion-100",
          "bg-motion-200",
          "bg-motion-300",
          "bg-motion-400",
          "bg-motion-500",
          "bg-motion-600",
          "bg-motion-700",
          "bg-motion-750",
          "bg-motion-800",
          "bg-motion-900",
        ]}
      />
      <Pallete
        className={[
          "bg-editor",
          "bg-editor-50",
          "bg-editor-100",
          "bg-editor-200",
          "bg-editor-300",
          "bg-editor-400",
          "bg-editor-500",
          "bg-editor-600",
          "bg-editor-700",
          "bg-editor-750",
          "bg-editor-800",
          "bg-editor-900",
        ]}
      />
    </div>
  );
}
