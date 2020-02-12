import * as React from 'react';

import withDefaultCard, {
  PropsToDefaultCard,
} from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import CollapseButton from 'components/old/ui/collapse/button/CollapseButton';
import List from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/list/List';
import {
  dashboardLoadCarInWorkOverall,
  dashboardSetInfoDataInCarInWorkOverall,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';
import CarInWorkOverallInfo from 'components/new/pages/dashboard/menu/cards/car-in-work-overall/info/CarInWorkOverallInfo';
import {
  etsUseDispatch,
  etsUseSelector,
} from 'components/@next/ets_hoc/etsUseDispatch';

import { getDashboardState } from 'redux-main/reducers/selectors';

import { CarInWorkOverallItemsType } from '../../../redux-main/modules/dashboard/@types/car-in-work-overall.h';

type Props = {};

const COUNT_TO_FIRST_SHOW = 2;

const CarInWorkOverall: React.FC<Props> = React.memo(() => {
  const dispatch = etsUseDispatch();

  const items = etsUseSelector(
    (state) => getDashboardState(state).car_in_work_overall.data.items,
  );

  const setInfoData = React.useCallback((item: CarInWorkOverallItemsType) => {
    dispatch(dashboardSetInfoDataInCarInWorkOverall(item));
  }, []);

  const [firstTwoItem, collapsedItems] = React.useMemo(
    () => [
      items.slice(0, COUNT_TO_FIRST_SHOW),
      items.slice(COUNT_TO_FIRST_SHOW),
    ],
    [items],
  );

  return (
    <div>
      <List
        items={firstTwoItem}
        onClick={setInfoData}
        classNameContainer="line_data"
      />
      {Boolean(collapsedItems.length) ? (
        <CollapseButton>
          <List
            items={collapsedItems}
            onClick={setInfoData}
            classNameContainer="line_data"
          />
        </CollapseButton>
      ) : null}
    </div>
  );
});

export default withDefaultCard<PropsToDefaultCard>({
  path: 'car_in_work_overall',
  loadData: dashboardLoadCarInWorkOverall,
  InfoComponent: CarInWorkOverallInfo,
})(CarInWorkOverall);
