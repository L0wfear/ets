import * as React from 'react';

const SimpleLinkA = React.memo(
  ({ title, href }: { title?: string, href: string }) => (
    <a href={href}>{title || href}</a>
  ),
);

export default SimpleLinkA;
