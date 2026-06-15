'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export function HelperTooltip({ text, children, term }: { text: string; children?: ReactNode; term?: string }) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const searchTerm = term || text.split(':')[0] || 'term';
      router.push(`/glossary?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children ? (
            <span 
              onClick={handleClick}
              className="inline-flex items-center gap-1.5 cursor-help group"
              title="Ctrl+Click to view in Glossary"
            >
              {children}
              <Info className="w-3.5 h-3.5 text-muted-app group-hover:text-accent-app transition-colors shrink-0" />
            </span>
          ) : (
            <button 
              onClick={handleClick}
              title="Ctrl+Click to view in Glossary"
              className="text-muted-app hover:text-accent-app transition-colors cursor-help inline-flex items-center"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 max-w-[280px] px-3 py-2 text-xs text-primary-app bg-app-secondary border border-app rounded-md shadow-xl animate-in-fade"
            sideOffset={5}
            align="start"
          >
            {text}
            <Tooltip.Arrow className="fill-app-secondary" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
