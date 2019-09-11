import * as React from 'react';
import * as cx from 'classnames';

type PropsList = {
  items: any[];
  handleClick: any;
  classNameContainer?: string;
};

const List: React.FC<PropsList> = React.memo(
  (props) => (
    <div>
      {
        props.items.map(({ subItems = [], value, ...item } , index) => (
          <div
            key={index}
            data-path={index}
            className={cx(
              {
                'pointer': Boolean(subItems[0]),
                'no-pointer-events': !Boolean(subItems[0]),
              },
              'line_data',
              'number',
              props.classNameContainer,
            )}
            onClick={props.handleClick}
            title={item.tooltip || value}
          >
            {value}
          </div>
        ))
      }
    </div>
  ),
);

export default List;
