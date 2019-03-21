import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/edc_request/_config-data/registry-config';

import {
  EdcRequestListProps, EdcRequestListOwnProps, EdcRequestListDispatchProps, EdcRequestListStateProps, EdcRequestListMergedProps,
} from 'components/new/pages/edc_request/EdcRequestList.h';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

const EdcRequestList: React.FC<EdcRequestListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(config);

      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
      <>
      <Registry
        registryKey={registryKey}
      />
    </>
  );
};

export default compose<EdcRequestListProps, EdcRequestListOwnProps>(
  connect<EdcRequestListStateProps, EdcRequestListDispatchProps, EdcRequestListOwnProps, EdcRequestListMergedProps, ReduxState>(
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
)(EdcRequestList);
