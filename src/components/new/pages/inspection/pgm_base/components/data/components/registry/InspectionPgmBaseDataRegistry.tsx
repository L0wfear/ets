import * as React from 'react';
import { BoxContainerRegistry } from 'components/new/pages/inspection/pgm_base/components/data/styled/InspectionPgmBaseData';
import { compose } from 'recompose';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';
import { InspectionPgmBaseDataRegistryProps, InspectionPgmBaseDataRegistryOwnProps, InspectionPgmBaseDataRegistryDispatchProps, InspectionPgmBaseDataRegistryStateProps, InspectionPgmBaseDataRegistryMergeProps } from './@types/InspectionPgmBaseDataRegistry';
import { ReduxState } from 'redux-main/@types/state';
import Registry from 'components/new/ui/registry/components/Registry';
import { registryAddInitialData, registryRemoveData, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { getInspectionPgmBaseDataRegistryConfig } from './config';
import IADRegistryTriggerOnRead from './components/IADRegistryTriggerOnRead';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const registryKey = 'inspectPgmBase';

const InspectionPgmBaseDataRegistry: React.FC<InspectionPgmBaseDataRegistryProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(
        getInspectionPgmBaseDataRegistryConfig(props),
      );

      props.registryLoadDataByKey(registryKey);

      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [props.searchState],
  );

  return (
    <BoxContainerRegistry>
      <Registry registryKey={registryKey} />
      <IADRegistryTriggerOnRead registryKey={registryKey} />
    </BoxContainerRegistry>
  );
};

export default compose<InspectionPgmBaseDataRegistryProps, InspectionPgmBaseDataRegistryOwnProps>(
  connect<InspectionPgmBaseDataRegistryStateProps, InspectionPgmBaseDataRegistryDispatchProps, InspectionPgmBaseDataRegistryOwnProps, InspectionPgmBaseDataRegistryMergeProps, ReduxState>(
    (state) => ({
      inspectPgmBaseList: getInspectPgmBase(state).inspectPgmBaseList,
    }),
    (dispatch: any) => ({
      registryAddInitialData: (config) => (
        dispatch(
          registryAddInitialData(config),
        )
      ),
      registryRemoveData: (registryKeyTemp: string) => (
        dispatch(
          registryRemoveData(registryKeyTemp),
        )
      ),
      registryLoadDataByKey: (registryKeyTemp: string) => (
        dispatch(
          registryLoadDataByKey(registryKeyTemp),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(InspectionPgmBaseDataRegistry);
