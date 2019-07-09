import * as React from 'react';
import { saveData, getCanvasOfImgUrl } from 'utils/functions';
import { useDispatch } from 'react-redux';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

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

    const dispatch = useDispatch();

    const handleClick = React.useCallback(
      async (event: React.MouseEvent) => {
        event.preventDefault();
        if ('onClick' in props) {
          props.onClick(props, event);
        }

        const loadPromise = () => {
          return new Promise(
            async (res) => {
              const canvas = await getCanvasOfImgUrl(__DEVELOPMENT__ ? 'https://a.wattpad.com/cover/99141245-352-k673828.jpg' : props.href);
              const div = document.createElement('div');
              div.setAttribute('style', 'display:none;');
              document.body.appendChild(div);
              div.appendChild(canvas);

              canvas.toBlob(
                (blob) => {
                  saveData(blob, props.title);
                  res(blob);
                  document.body.removeChild(div);
                },
              );

            },
          );
        };

        await etsLoadingCounter(
          dispatch,
          loadPromise(),
          {
            page: 'main',
          },
        );
      },
      [dispatch, props],
    );

    const handleDoubleClick = React.useCallback(
      async (event: React.MouseEvent) => {
        event.preventDefault();
      },
      [],
    );

    return React.useMemo(
      () => (
        <a
          id={id}
          className={className}
          href={href}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          target={props.target}
        >
          {title || children || href}
        </a>
      ),
      [
        id,
        className,
        href,
        handleClick,
        handleDoubleClick,
        props.target,
        title || children || href,
      ],
    );
  },
);

export default SimpleSaveLinkA;
