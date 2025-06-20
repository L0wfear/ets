import * as React from 'react';

import { CarInWorkOverallItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';
import ListItem from './ListItem';

type PropsList = {
  items: Array<CarInWorkOverallItemsType>;
  onClick(item: CarInWorkOverallItemsType): void;
  classNameContainer?: string;
};

const List: React.FC<PropsList> = React.memo((props) => {
  const { onClick, items } = props;

  return <ul>{items.map((item, index) => {
    const canClick = item.subItems?.some?.((rowData) => rowData?.subItems?.length);

    return (
      <ListItem canClick={canClick} key={index} item={item} onClick={onClick} />
    );
  })}</ul>;
});

export default List;
