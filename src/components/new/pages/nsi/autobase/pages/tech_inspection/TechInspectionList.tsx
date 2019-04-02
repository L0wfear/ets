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
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

export type TechInspectionListStateProps = {};
export type TechInspectionListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type TechInspectionListOwnProps = {};
export type TechInspectionListMergedProps = (
  TechInspectionListStateProps
  & TechInspectionListDispatchProps
  & TechInspectionListOwnProps
);
export type TechInspectionListProps = (
  TechInspectionListMergedProps
) & WithSearchProps;

const TechInspectionList: React.FC<TechInspectionListProps> = (props) => {
  const car_id = getNumberValueFromSerch(props.match.params.car_actual_asuods_id);

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
      <TechInspectionFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<TechInspectionListProps, TechInspectionListOwnProps>(
  withPreloader({
    page: getToConfig().registryKey,
    typePreloader: 'mainpage',
  }),
  connect<TechInspectionListStateProps, TechInspectionListDispatchProps, TechInspectionListOwnProps, TechInspectionListMergedProps, ReduxState>(
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
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(TechInspectionList);
