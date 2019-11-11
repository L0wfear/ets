import * as React from 'react';
import * as cx from 'classnames';

import {
  CarInWorkOverallItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';

type PropsList = {
  items: Array<CarInWorkOverallItemsType>;
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
  addIndex: number;
};

const List: React.FC<PropsList> = React.memo(
  (props) => {
    const handleClick = React.useCallback(
      (event) => {
        const { currentTarget: { dataset: { path } } } = event;
        const index = Number.parseInt((path as string).split('/').slice(-1)[0], 0);

        const subItemsLength = props.items?.[index]?.subItems?.some?.((rowData) => rowData?.subItems?.length);

        if (subItemsLength) {
          props.handleClick(event);
        }
      },
      [props.items, props.handleClick],
    );

    return (
      <ul>
        {
          props.items.map(({ subItems = [], title, ...item } , index) => {
            const canClick = subItems?.some?.((rowData) => rowData?.subItems?.length);
            return (
              <li
                key={index + props.addIndex}
                data-path={index + props.addIndex}
                title={item.tooltip || title}
                className={cx(
                  {
                    pointer: canClick,
                    default_cursor: !canClick,
                  },
                  props.classNameContainer,
                )}
                onClick={handleClick}
              >
                {title}
              </li>
            );
          })
        }
      </ul>
    );
  },
);

export default List;




