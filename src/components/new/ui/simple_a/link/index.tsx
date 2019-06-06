import * as React from 'react';

type PropsSimpleLinkA = {
  id?: string;
  className?: string;
  title?: string;
  target?: string;
  href?: string;
  onClick?: (props: PropsSimpleLinkA, event: React.MouseEvent) => any;
  [k: string]: any;
};

const SimpleLinkA: React.FC<PropsSimpleLinkA> = React.memo(
  (props) => {
    const { id, className, title, children, href } = props;

    const handleClick = React.useCallback(
      (event: React.MouseEvent) => {
        if ('onClick' in props) {
          props.onClick(props, event);
        }
      },
      [props],
    );

    return (
      <a id={id} className={className} href={href} onClick={handleClick} target={props.target}>{title || children || href}</a>
    );
  },
);

export default SimpleLinkA;
