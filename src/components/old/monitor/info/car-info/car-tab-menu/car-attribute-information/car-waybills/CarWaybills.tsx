import * as React from 'react';
import { connect } from 'react-redux';

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
};

type StateProps = {
  carActualGpsNumberIndex: any;
};

type PropsCarMissions = OwnProps & DispatchProps & StateProps;

const CarWaybills: React.FC<PropsCarMissions> = React.memo(({
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
    carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
  }),
  (dispatch: any) => ({
    dispatch,
  })
)(CarWaybills);
