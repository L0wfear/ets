import * as React from 'react';
import { connect } from 'react-redux';

import { fetchCarWaybills } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import { ReduxState } from 'redux-main/@types/state';
import { CarInfoBlockTabDataColumn } from 'components/old/monitor/styled';
import { CarInfoTrackDateTitle } from 'components/old/monitor/info/geoobjects-info/styled';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import WaybillsList from 'components/old/monitor/info/car-info/car-tab-menu/car-attribute-information/car-waybills/waybills-list/WaybillsList';

type PropsCarMissions = {
  asuods_id: number;
  gps_code: string;
  fetchWaybillsData: any;
  dispatch: EtsDispatch;
  date_end: string;
  date_start: string;
};

const CarWaybills: React.FC<PropsCarMissions> = React.memo(({asuods_id, date_end, date_start, fetchWaybillsData}) => {

  React.useEffect(() => {
    fetchWaybillsData({
      asuods_id,
    });
  }, [asuods_id, date_end, date_start]);
  
  return (
    <CarInfoBlockTabDataColumn>
      <CarInfoTrackDateTitle>
        <div>Путевые листы</div>
      </CarInfoTrackDateTitle>
      <WaybillsList />
    </CarInfoBlockTabDataColumn>
  );
});

export default connect<any, any, any, ReduxState>(
  (state) => ({
    gps_code: state.monitorPage.carInfo.gps_code,
    asuods_id: (
      state.monitorPage.carActualGpsNumberIndex[
        state.monitorPage.carInfo.gps_code
      ] || { asuods_id: null }
    ).asuods_id,
    date_end: state.monitorPage.carInfo.date_end,
    date_start: state.monitorPage.carInfo.date_start,
  }),
  (dispatch: any) => ({
    dispatch,
    fetchWaybillsData: (props) => {
      return dispatch(
        fetchCarWaybills(
          {
            asuods_id: props.asuods_id,
          },
          {
            page: 'mainpage',
          }
        )
      );
    },
  })
)(CarWaybills);
