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
      props.items.map(({ sub_items = [], title, ...item }, index) => (
        <div key={`${item.object_type}/${item.technical_operation_id}/${item.work_class_id}/${(title as string).split(' ').map(word => word[0]).join('/')}`} data-path={`${index}`} className={cx({ pointer: sub_items.length, 'no-pointer-events': !sub_items.length }, props.classNameContainer)} onClick={props.handleClick} title={item.tooltip || title}>{title}</div>
      ))
    }
  </div>
);
               
export default List;