import * as React from 'react';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { DivNone } from 'global-styled/global-styled';
import { compose } from 'recompose';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import { get } from 'lodash';

type IADRegistryTriggerOnReadInputPropsProps = { registryKey: string };
type IADRegistryTriggerOnReadStateProps = {
  element: InspectAutobase | null;
};

type IADRegistryTriggerOnReadProps = (
  IADRegistryTriggerOnReadStateProps
  & IADRegistryTriggerOnReadInputPropsProps
  & WithSearchProps
);

const IADRegistryTriggerOnRead: React.FC<IADRegistryTriggerOnReadProps> = (props) => {
  const id = get(props, 'match.params.id', null);

  React.useEffect(
    () => {
      if (props.element && (!id || Number(id) !== props.element.id)) {
        props.setParams({
          id: props.element.id,
          type: '',
        });
      }
    },
    [
      id,
      props.element,
      props.location.search,
      props.match.url,
      props.match.params,
    ],
  );

  return (
    <DivNone />
  );
};

export default compose<IADRegistryTriggerOnReadProps, IADRegistryTriggerOnReadInputPropsProps>(
  connect<IADRegistryTriggerOnReadStateProps, {}, IADRegistryTriggerOnReadInputPropsProps, ReduxState>(
    (state, { registryKey }) => ({
      element: getListData(state.registry, registryKey).data.selectedRowToShow as InspectAutobase,
    }),
  ),
  withSearch,
)(IADRegistryTriggerOnRead);
