import * as React from 'react';
import * as cx from 'classnames';
import { ListItem } from 'components/new/pages/dashboard/menu/cards/waybill-completed/list/List';

type PropsListNumber = {
  items: Array<any>;
  handleClick: any;
  classNameContainer?: string;
};

const ListNumber: React.FC<PropsListNumber> = React.memo(
  (props) => {

    return (<div>
      {props.items.map((item, index) => (
        item.title
          ? <ListItem
            key={index}
            data-path={`${index }`}
            handleClick={props.handleClick}
            title={item.tooltip || item.title}
            subItems={item.subItems}
            item={item}
            index={index}
            addIndex={0}
          />
          : <div
            key={index}
            data-path={index}
            className={cx({
              'pointer': Boolean(item.subItems[0]),
              'no-pointer-events': !Boolean(item.subItems[0]),
            }, 'line_data', 'number', props.classNameContainer)}
            onClick={props.handleClick}
            title={item.tooltip || item.value}>
            {item.value}
          </div>
      ))}
    </div>);
  },
);

export default ListNumber;
