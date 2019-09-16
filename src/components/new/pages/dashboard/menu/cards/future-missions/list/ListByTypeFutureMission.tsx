import * as React from 'react';

import CollapseListFutureMission from 'components/new/pages/dashboard/menu/cards/future-missions/list/collapse-by-type/CollapseListFutureMission';

import DefaultDashboardCardList from 'components/new/pages/dashboard/menu/cards/_default-list/DefaultDashboardCardList';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {
  titleKey: 'title_centralized' | 'title_decentralized';
  itemsKey: 'items_centralized' | 'items_decentralized';
  handleClick: (id: number) => any;
};

const ListByTypeMission: React.FC<Props> = React.memo(
  (props) => {
    const title = etsUseSelector((state) => getDashboardState(state).future_missions.data[props.titleKey]);
    const items = etsUseSelector((state) => getDashboardState(state).future_missions.data[props.itemsKey]);

    return (
      <DefaultDashboardCardList
        title={title}
        noClickOnTitle={!items.length}
      >
        <CollapseListFutureMission collapsetItems={items} handleClick={props.handleClick} />
      </DefaultDashboardCardList>
    );
  },
);

export default ListByTypeMission;
