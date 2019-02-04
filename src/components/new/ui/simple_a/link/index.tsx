import * as React from 'react';

type PropsSimpleLinkA = {
  id?: string;
  className?: string;
  title?: string;
  href: string;
};

const SimpleLinkA: React.FunctionComponent<PropsSimpleLinkA> = ({ id, className, title, children, href }) => (
  <a id={id} className={className} href={href}>{title || children || href}</a>
);

export default SimpleLinkA;
