import * as React from 'react';
import { BoxContainerRegistry } from '../../styled/InspectionAutobaseData';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { getInspectAutobse } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';
import { InspectionAutobaseDataRegistryProps, InspectionAutobaseDataRegistryOwnProps, InspectionAutobaseDataRegistryDispatchProps, InspectionAutobaseDataRegistryStateProps, InspectionAutobaseDataRegistryMergeProps } from './@types/InspectionAutobaseDataRegistry';
import { ReduxState } from 'redux-main/@types/state';
import Registry from 'components/new/ui/registry/components/Registry';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import { getInspectionAutobaseDataRegistryConfig } from './config';
import IADRegistryTriggerOnRead from './components/IADRegistryTriggerOnRead';

const registryKey = 'inspectAutobase';

const InspectionAutobaseDataRegistry: React.FC<InspectionAutobaseDataRegistryProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(
        getInspectionAutobaseDataRegistryConfig(props),
      );

      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [props.inspectAutobaseList],
  );

  return (
    <BoxContainerRegistry>
      <Registry
        registryKey={registryKey}
      />
      <IADRegistryTriggerOnRead registryKey={registryKey} />
    </BoxContainerRegistry>
  );
};

export default compose<InspectionAutobaseDataRegistryProps, InspectionAutobaseDataRegistryOwnProps>(
  connect<InspectionAutobaseDataRegistryStateProps, InspectionAutobaseDataRegistryDispatchProps, InspectionAutobaseDataRegistryOwnProps, InspectionAutobaseDataRegistryMergeProps, ReduxState>(
    (state) => ({
      inspectAutobaseList: getInspectAutobse(state).inspectAutobaseList,
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
    }),
    null,
    {
      pure: false,
    },
  ),
  withRouter,
)(InspectionAutobaseDataRegistry);
