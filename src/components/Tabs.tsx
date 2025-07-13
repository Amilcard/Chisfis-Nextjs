interface Tab { 
  key: string; 
  label: string 
}

interface Props { 
  options: Tab[]; 
  activeKey: string; 
  onChange: (k: string) => void 
}

export default function Tabs({ options, activeKey, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-200 mt-6">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-6 py-3 font-medium transition-colors ${
            activeKey === key
              ? 'border-b-2 border-brand-green text-brand-green bg-green-50'
              : 'text-neutral-500 hover:text-brand-green'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
