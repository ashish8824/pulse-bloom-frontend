import { clsx } from "clsx";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === tab.id
              ? "bg-brand-600 text-white shadow-sm"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
