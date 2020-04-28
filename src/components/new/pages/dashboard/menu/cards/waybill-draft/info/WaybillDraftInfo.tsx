import * as React from 'react';
import memoize from 'memoize-one';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { groupBy } from 'lodash';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';

import InfoCard from 'components/new/pages/dashboard/menu/cards/_default-card-component/info-card/InfoCard';

import {
  dashboardLoadDependentDataByWaybillDraft,
  dashboardSetInfoDataInWaybillDraft,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/actions-dashboard';

import { makeDate } from 'components/@next/@utils/dates/dates';

import WaybillFormWrapTSX from 'components/old/waybill/WaybillFormWrap';

import {
  PropsWaybillDraftInfo,
  StateWaybillDraftInfo,
} from 'components/new/pages/dashboard/menu/cards/waybill-draft/info/WaybillDraftInfo.h';
import { WaybillDraftItemsSubItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/waibill-draft.h';
import { TitleWaybillInfoContainer } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-default-waybill/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { actionGetWaybillById } from 'redux-main/reducers/modules/waybill/waybill_actions';

const WaybillFormWrap: any = WaybillFormWrapTSX;

class WaybillDraftInfo extends React.PureComponent<PropsWaybillDraftInfo, StateWaybillDraftInfo> {
  state = {
    showWaybillFormWrap: false,
    elementWaybillFormWrap: null,
  };

  filterInfoData = memoize((infoData) => {
    if (infoData) {
      return groupBy<WaybillDraftItemsSubItemsType>(
        infoData.subItems,
        (waybill) => makeDate(waybill.date_create),
      );
    }

    return {};
  });

  handleClose: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.handleClose();
  };

  openWaybillFormWrap: React.MouseEventHandler<HTMLLIElement> = ({
    currentTarget: {
      dataset: { path },
    },
  }) => {
    this.props.dispatch(
      actionGetWaybillById(
        Number.parseInt(path, 0),
        { page: 'dashboard' },
      ),
    ).then((waybill_data) => {
      if (waybill_data) {
        this.setState({
          showWaybillFormWrap: true,
          elementWaybillFormWrap: waybill_data,
        });
      } else {
        // tslint:disable-next-line
        console.warn('not find waybill');
      }
    });
  };

  handleWaybillFormWrapHide = () => {
    this.setState({
      showWaybillFormWrap: false,
      elementWaybillFormWrap: null,
    });
  };

  handleWaybillFormWrapHideAfterSubmit = (newState) => {
    this.props.loadAllWaybillCard();
    this.setState({
      showWaybillFormWrap: false,
      elementWaybillFormWrap: null,
      ...newState,
    });
  };

  mapArrData = ({ id, gov_number, garage_number, }) => (
    <li
      key={id}
      className="pointer"
      data-path={id}
      onClick={this.openWaybillFormWrap}>
      {`${gov_number}`}
      {`${garage_number
        ? `, ${garage_number}`
        : ''}`}
    </li>
  );

  mapInfoDataGroupByDate = ([key, arrData]) => {
    return (<div key={key}>
      <TitleWaybillInfoContainer>{key}</TitleWaybillInfoContainer>
      <div>
        <ul>{arrData.map(this.mapArrData)}</ul>
      </div>
    </div>);
  };

  render() {
    const { infoData } = this.props;

    const infoDataGroupByDate = this.filterInfoData(infoData);

    return (
      <InfoCard title="Рег. номер ТС" handleClose={this.handleClose}>
        {Object.entries(infoDataGroupByDate)
          .sort()
          .map(this.mapInfoDataGroupByDate)
        }
        {
          this.state.showWaybillFormWrap && (
            <WaybillFormWrap
              onFormHide={this.handleWaybillFormWrapHideAfterSubmit}
              onCallback={this.handleWaybillFormWrapHideAfterSubmit}
              element={this.state.elementWaybillFormWrap}
            />
          )
        }
      </InfoCard>
    );
  }
}

export default compose<any, any>(
  withShowByProps({
    path: ['dashboard', 'waybill_draft', 'infoData'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      infoData: getDashboardState(state).waybill_draft.infoData,
      infoDataRaw: getDashboardState(state).waybill_draft.data.items[0],
    }),
    (dispatch) => ({
      dispatch,
      handleClose: () => dispatch(dashboardSetInfoDataInWaybillDraft(null)),
      loadAllWaybillCard: () =>
        dispatch(dashboardLoadDependentDataByWaybillDraft()),
    }),
  ),
)(WaybillDraftInfo);
