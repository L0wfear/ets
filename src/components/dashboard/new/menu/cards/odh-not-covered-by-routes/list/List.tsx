import * as React from 'react';
import * as cx from 'classnames';

type PropsList = {
  items: any[];
  handleClick: any;
  classNameContainer?: string;
}

const List: React.SFC<PropsList> = props => (
  <div>
    {
      props.items.map(({ subItems = [], title, ...item }, index) => (
        <div key={item.technical_operation_id} data-path={`${index}`} className={cx({ pointer: subItems.length, 'no-pointer-events': !subItems.length }, props.classNameContainer)} onClick={props.handleClick} title={item.tooltip || title}>{title}</div>
      ))
    }
  </div>
);
               
export default List;