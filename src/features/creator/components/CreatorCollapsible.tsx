import { useState, type JSX, type ReactNode } from 'react';

interface CreatorCollapsibleProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly defaultCollapsed?: boolean;
}

export function CreatorCollapsible({
  title,
  children,
  defaultCollapsed = true,
}: CreatorCollapsibleProps): JSX.Element {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggle = (): void => setCollapsed((value) => !value);

  return (
    <>
      <h5
        className={`collapsible ${collapsed ? 'collapsed' : ''} padding input-description`}
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle();
          }
        }}
      >
        {title}
      </h5>
      <div className="padding">{children}</div>
    </>
  );
}
