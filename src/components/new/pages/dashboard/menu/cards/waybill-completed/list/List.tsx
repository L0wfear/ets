import * as React from 'react';
import * as cx from 'classnames';

type PropsList = {
  items: Array<any>;
  handleClick: any;
  classNameContainer?: string;
  addIndex?: number;
};

type PropsListItem = {
  index: number;
  addIndex: number;
  subItems: Array<any>;
  classNameContainer?: string;
  handleClick: any;
  item: any;
  title: any;
};

export const ListItem: React.FC<PropsListItem> = (props) => (
  <li
    key={props.index}
    data-path={`${props.index + props.addIndex}`}
    className={cx(
      {
        'pointer': !!props.subItems.length,
        'no-pointer-events': !props.subItems.length,
      },
      props.classNameContainer,
    )}
    onClick={props.handleClick}
    title={props.item.tooltip || props.title}
  >
    {
      props.item.value || props.item.value === 0
        ? `${props.title} : ${props.item.value}`
        : props.title
    }
  </li>
);

const List: React.FC<PropsList> = ({ addIndex = 0, ...props }) => (
  <ul>
    {
      props.items.map(({ subItems = [], title, ...item } , index) => (
        <ListItem
          key={index}
          data-path={`${index + addIndex}`}
          handleClick={props.handleClick}
          title={item.tooltip || title}
          subItems={subItems}
          item={item}
          index={index}
          addIndex={addIndex}
        />
      ))
    }
  </ul>
);

export default List;
