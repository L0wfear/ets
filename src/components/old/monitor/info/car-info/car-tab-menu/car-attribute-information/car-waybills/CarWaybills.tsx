import * as React from 'react';
import { connect } from 'react-redux';

import { fetchCarWaybills } from 'components/old/monitor/info/car-info/redux-main/modules/actions-car-info';
import { ReduxState } from 'redux-main/@types/state';
import { CarInfoBlockTabDataColumn } from 'components/old/monitor/styled';
import { CarInfoTrackDateTitle } from 'components/old/monitor/info/geoobjects-info/styled';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import WaybillsList from 'components/old/monitor/info/car-info/car-tab-menu/car-attribute-information/car-waybills/waybills-list/WaybillsList';
import { useParams } from 'react-router-dom';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { actionGetWaybillById } from 'redux-main/reducers/modules/waybill/waybill_actions';

type OwnProps = {
  setShowWaybillForm: React.Dispatch<any>;
  setWaybillData: React.Dispatch<any>;
  setDefaultCarData: React.Dispatch<any>;
  gps_code: number;
  showWaybillForm: boolean;
};

type DispatchProps = {
  dispatch: EtsDispatch;
  fetchWaybillsData: any;
};

type StateProps = {
  asuods_id: number;
  date_end: string | Date;
  date_start: string | Date;
  carActualGpsNumberIndex: any;
};

type PropsCarMissions = OwnProps & DispatchProps & StateProps;

const CarWaybills: React.FC<PropsCarMissions> = React.memo(({
  asuods_id, 
  date_end, 
  date_start, 
  fetchWaybillsData,
  setShowWaybillForm,
  setWaybillData,
  setDefaultCarData,
  dispatch,
  showWaybillForm,
  gps_code,
  carActualGpsNumberIndex,
}) => {

  const [stateWaybillId, setStateWaybillId] = React.useState(null);
  const { waybill_id } = useParams();

  React.useEffect(() => {
    fetchWaybillsData({
      asuods_id,
    });
  }, [asuods_id, date_end, date_start]);

  React.useEffect(() => {
    if(waybill_id === 'create' && !showWaybillForm) {
      const carInfo: Car = carActualGpsNumberIndex[gps_code];
      const defaultCarData = {
        car_id: carInfo.asuods_id,
        model_id: carInfo.model_id,
        gov_number: carInfo.gov_number,
      };
      setDefaultCarData(defaultCarData);
      setShowWaybillForm(true);
    }
    if(!Number.isNaN(Number(waybill_id)) && waybill_id !== stateWaybillId) {
      setShowWaybillForm(false);
      setWaybillData(null);
      setDefaultCarData(null);
      dispatch(
        actionGetWaybillById(
          Number(waybill_id),
          { page: 'monitor' },
        ),
      ).then((waybill_data) => {
        if (waybill_data) {
          setWaybillData(waybill_data);
          setShowWaybillForm(true);
          setStateWaybillId(Number(waybill_id));
        } else {
          // tslint:disable-next-line
          console.warn('not find waybill');
        }
      });
    }

    if(!waybill_id && showWaybillForm) {
      setShowWaybillForm(false);
      setWaybillData(null);
      setDefaultCarData(null);
    }
  }, [waybill_id]);
  
  return (
    <CarInfoBlockTabDataColumn>
      <CarInfoTrackDateTitle>
        <div>Путевые листы</div>
      </CarInfoTrackDateTitle>
      <WaybillsList />
    </CarInfoBlockTabDataColumn>
  );
});

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    asuods_id: (
      state.monitorPage.carActualGpsNumberIndex[
        state.monitorPage.carInfo.gps_code
      ] || { asuods_id: null }
    ).asuods_id,
    date_end: state.monitorPage.carInfo.date_end,
    date_start: state.monitorPage.carInfo.date_start,
    carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
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
