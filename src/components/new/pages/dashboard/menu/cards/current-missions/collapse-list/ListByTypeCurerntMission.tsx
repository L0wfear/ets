import * as React from 'react';

import DefaultDashboardCardList from 'components/new/pages/dashboard/menu/cards/_default-list/DefaultDashboardCardList';

import CollapseListByLvl from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/CollapseListByLvl/CollapseListByLvl';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { CurrentMissionsItemsSubItemsSubItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

export type Props = {
  titleKey: 'title_centralized' | 'title_decentralized';
  itemsKey: 'items_centralized' | 'items_decentralized';
  handleClick: (lastSubItem: CurrentMissionsItemsSubItemsSubItemsType) => any;
};

const ListByTypeCurerntMission: React.FC<Props> = React.memo(
  (props) => {
    const title = etsUseSelector((state) => getDashboardState(state).current_missions.data[props.titleKey]);
    const items = etsUseSelector((state) => getDashboardState(state).current_missions.data[props.itemsKey]);

    return (
      <DefaultDashboardCardList
        title={title}
        noClickOnTitle={!items.length}
      >
        <CollapseListByLvl
          collapsetItems={items}
          handleClick={props.handleClick}
        />
      </DefaultDashboardCardList>
    );
  },
);

export default ListByTypeCurerntMission;
