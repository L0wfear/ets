import * as React from 'react';
import * as cx from 'classnames';
import { get } from 'lodash';

import {
  PropsList,
} from 'components/dashboard/menu/cards/car-in-work-overall/list/List.h';

class List extends React.PureComponent<PropsList, {}> {
  handleClick: React.MouseEventHandler<HTMLLIElement> = (event) => {
    const { currentTarget: { dataset: { path } } } = event;
    const index = Number.parseInt((path as string).split('/').slice(-1)[0], 0);

    const subItemsLength = get(this.props.items, [index, 'subItems', 'length'], 0);

    if (subItemsLength) {
      this.props.handleClick(event);
    }
  }
  render() {
    const { props } = this;

    return (
      <ul>
        {
          props.items.map(({ subItems = [], title, ...item } , index) => (
            <li
              key={index + props.addIndex}
              data-path={index}
              title={item.tooltip || title}
              className={cx(
                {
                  pointer: subItems.length,
                  default_cursor: !subItems.length,
                },
                props.classNameContainer,
              )}
              onClick={this.handleClick}
            >
              {title}
            </li>
          ))
        }
      </ul>
    );
  }
}

export default List;
