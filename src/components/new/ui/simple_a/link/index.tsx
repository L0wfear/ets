import * as React from 'react';

const SimpleLinkA = React.memo<{ id?: string; className?: string; title?: string, href: string }>(
  ({ id, className, title, children, href }) => (
    <a id={id} className={className} href={href}>{title || children || href}</a>
  ),
);

export default SimpleLinkA;
