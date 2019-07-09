import * as React from 'react';
import { saveData } from 'utils/functions';
import { useDispatch } from 'react-redux';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { getBlob } from 'api/adapterBlob';

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
              const { blob }: any = await getBlob(props.href, {});

              saveData(blob, props.title);

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
