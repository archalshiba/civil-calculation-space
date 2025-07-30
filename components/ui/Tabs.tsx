

import React, { useState, useRef, useEffect, useId } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
  }, [tabs]);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    if (event.key === 'ArrowRight') {
      newIndex = (index + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    }
    
    if (newIndex !== index) {
      setActiveTab(newIndex);
      tabRefs.current[newIndex]?.focus();
    }
  };

  return (
    <div>
      <div className="border-b border-border mb-6">
        <div role="tablist" className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              id={`${baseId}-tab-${index}`}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={`${baseId}-panel-${index}`}
              onClick={() => setActiveTab(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={activeTab === index ? 0 : -1}
              className={`${
                activeTab === index
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-500'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        {tabs.map((tab, index) => (
          <div
            key={index}
            id={`${baseId}-panel-${index}`}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`${baseId}-tab-${index}`}
            className={activeTab === index ? 'block focus:outline-none' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;