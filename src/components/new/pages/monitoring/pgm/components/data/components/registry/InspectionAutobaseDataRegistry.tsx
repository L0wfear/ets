import * as React from 'react';
import { BoxContainerRegistry } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { compose } from 'recompose';
import { getInspectAutobase } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';
import { InspectionAutobaseDataRegistryProps, InspectionAutobaseDataRegistryOwnProps, InspectionAutobaseDataRegistryDispatchProps, InspectionAutobaseDataRegistryStateProps, InspectionAutobaseDataRegistryMergeProps } from './@types/InspectionAutobaseDataRegistry';
import { ReduxState } from 'redux-main/@types/state';
import Registry from 'components/new/ui/registry/components/Registry';
import { registryAddInitialData, registryRemoveData, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { getInspectionAutobaseDataRegistryConfig } from './config';
import IADRegistryTriggerOnRead from './components/IADRegistryTriggerOnRead';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const registryKey = 'inspectAutobase';

const InspectionAutobaseDataRegistry: React.FC<InspectionAutobaseDataRegistryProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(
        getInspectionAutobaseDataRegistryConfig(props),
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

export default compose<InspectionAutobaseDataRegistryProps, InspectionAutobaseDataRegistryOwnProps>(
  connect<InspectionAutobaseDataRegistryStateProps, InspectionAutobaseDataRegistryDispatchProps, InspectionAutobaseDataRegistryOwnProps, InspectionAutobaseDataRegistryMergeProps, ReduxState>(
    (state) => ({
      inspectAutobaseList: getInspectAutobase(state).inspectAutobaseList,
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
)(InspectionAutobaseDataRegistry);
