import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { HandleThunkActionCreator } from 'react-redux';

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

import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

type StateProps = {
  items: ReduxState['dashboard']['car_in_work_overall']['data']['items'];
};

type DispatchProps = {
  setInfoData: HandleThunkActionCreator<
    typeof dashboardSetInfoDataInCarInWorkOverall
  >;
};

type OwnProps = {
  countToFirstShow?: number;
};

type Props = StateProps & DispatchProps & OwnProps;

function CarInWorkOverall(props: Props): JSX.Element {
  const { items, setInfoData, countToFirstShow } = props;

  const [firstTwoItem, collapsedItems] = React.useMemo(
    () => [items.slice(0, countToFirstShow), items.slice(countToFirstShow)],
    [items, countToFirstShow],
  );

  return (
    <div>
      <List
        items={firstTwoItem}
        onClick={setInfoData}
        classNameContainer="line_data"
      />
      {Boolean(collapsedItems[0]) && (
        <CollapseButton>
          <List
            items={collapsedItems}
            onClick={setInfoData}
            classNameContainer="line_data"
          />
        </CollapseButton>
      )}
    </div>
  );
}

CarInWorkOverall.defaultProps = {
  items: [],
  countToFirstShow: 2,
};

const mapStateToProps = (state: ReduxState): StateProps => ({
  items: getDashboardState(state).car_in_work_overall.data.items,
});

const mapDispatchToProps: DispatchProps = {
  setInfoData: dashboardSetInfoDataInCarInWorkOverall,
};

export default compose<Props, PropsToDefaultCard>(
  withDefaultCard({
    path: 'car_in_work_overall',
    loadData: dashboardLoadCarInWorkOverall,
    InfoComponent: CarInWorkOverallInfo,
  }),
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(CarInWorkOverall);
