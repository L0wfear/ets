import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import TechInspectionFormLazy from 'components/new/pages/nsi/autobase/pages/tech_inspection/form';
import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tech_inspection/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { get } from 'lodash';
import { CarWrap } from '../car_actual/form/@types/CarForm';

export type TechInspectionListStateProps = {};
export type TechInspectionListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type TechInspectionListOwnProps = {
  selectedCarData?: CarWrap;
};
export type TechInspectionListMergedProps = (
  TechInspectionListStateProps
  & TechInspectionListDispatchProps
  & TechInspectionListOwnProps
);
export type TechInspectionListProps = (
  TechInspectionListMergedProps
);

const TechInspectionList: React.FC<TechInspectionListProps> = (props) => {
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
      <TechInspectionFormLazy
        registryKey={registryKey}
        selectedCarData={selectedCarData}
        />
    </>
  );
};

export default compose<TechInspectionListProps, TechInspectionListOwnProps>(
  withPreloader({
    page: getToConfig().registryKey,
    typePreloader: 'mainpage',
  }),
  connect<TechInspectionListStateProps, TechInspectionListDispatchProps, TechInspectionListOwnProps, ReduxState>(
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
)(TechInspectionList);
