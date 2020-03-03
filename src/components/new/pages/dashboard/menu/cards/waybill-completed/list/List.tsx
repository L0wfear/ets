import * as React from 'react';
import * as cx from 'classnames';

type PropsList = {
  items: Array<any>;
  handleClick: any;
  classNameContainer?: string;
  addIndex?: number;
};

const List: React.FC<PropsList> = ({ addIndex = 0, ...props }) => (
  <ul>
    {
      props.items.map(({ subItems = [], title, ...item } , index) => (
        <li
          key={index}
          data-path={`${index + addIndex}`}
          className={cx(
            {
              'pointer': !!subItems.length,
              'no-pointer-events': !subItems.length,
            },
            props.classNameContainer,
          )}
          onClick={props.handleClick}
          title={item.tooltip || title}
        >
          {title}
        </li>
      ))
    }
  </ul>
);

export default List;
