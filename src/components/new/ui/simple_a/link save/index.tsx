import * as React from 'react';
import { saveData, resizeBase64, getCanvasOfImgUrl } from 'utils/functions';

type PropsSimpleSaveLinkA = {
  id?: string;
  className?: string;
  title?: string;
  target?: string;
  href?: string;
  onClick?: (props: PropsSimpleSaveLinkA, event: React.MouseEvent) => any;
  [k: string]: any;
};

const SimpleSaveLinkA: React.FC<PropsSimpleSaveLinkA> = React.memo(
  (props) => {
    const { id, className, title, children, href } = props;

    const handleClick = React.useCallback(
      async (event: React.MouseEvent) => {
        event.preventDefault();
        if ('onClick' in props) {
          props.onClick(props, event);
        }

        const canvas = await getCanvasOfImgUrl(props.href);

        canvas.toBlob(
          (blob) => {
            saveData(blob, props.title);
          },
        );
      },
      [props],
    );

    return (
      <a id={id} className={className} href={href} onClick={handleClick} target={props.target}>{title || children || href}</a>
    );
  },
);

export default SimpleSaveLinkA;
