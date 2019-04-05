import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import RoadAccidentFormLazy from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { get } from 'lodash';
import { CarWrap } from '../../../@types/CarForm';

export type RoadAccidentListStateProps = {};
export type RoadAccidentListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type RoadAccidentListOwnProps = {
  selectedCarData?: CarWrap;
};
export type RoadAccidentListMergedProps = (
  RoadAccidentListStateProps
  & RoadAccidentListDispatchProps
  & RoadAccidentListOwnProps
);
export type RoadAccidentListProps = (
  RoadAccidentListMergedProps
);

const RoadAccidentList: React.FC<RoadAccidentListProps> = (props) => {
  const {
    selectedCarData,
  } = props;
  const car_id = get(selectedCarData, 'asuods_id', null);

  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig(car_id));
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [car_id],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <RoadAccidentFormLazy
        registryKey={registryKey}
        selectedCarData={selectedCarData}
      />
    </>
  );
};

export default compose<RoadAccidentListProps, RoadAccidentListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<RoadAccidentListStateProps, RoadAccidentListDispatchProps, RoadAccidentListOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      registryAddInitialData: (...any) => (
        dispatch(
          registryAddInitialData(...any),
        )
      ),
      registryRemoveData: (registryKeyTemp: string) => (
        dispatch(
          registryRemoveData(registryKeyTemp),
        )
      ),
    }),
  ),
)(RoadAccidentList);
