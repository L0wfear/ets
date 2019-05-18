import * as React from 'react';
import { compose } from 'recompose';

import { connect } from 'react-redux';
import { get } from 'lodash';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { Service } from 'redux-main/reducers/modules/services/@types/services';
import { ReduxState } from 'redux-main/@types/state';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type TrTdServiceButtonShowActionLogStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
};
type TrTdServiceButtonShowActionLogDispatchProps = {
};
type TrTdServiceButtonShowActionLogOwnProps = {
  registryKey: string;
  rowData: Service;
};
type TrTdServiceButtonShowActionLogMergedProps = (
  TrTdServiceButtonShowActionLogStateProps
  & TrTdServiceButtonShowActionLogDispatchProps
  & TrTdServiceButtonShowActionLogOwnProps
) & WithSearchProps;

type TrTdServiceButtonShowActionLogProps = TrTdServiceButtonShowActionLogMergedProps;

const TrTdServiceButtonShowActionLog: React.FC<TrTdServiceButtonShowActionLogProps> = React.memo(
  (props) => {
    const { rowData } = props;

    const handleClick = React.useCallback(
      async () => {
        props.setParams({
          [props.uniqKeyForParams]: get(props.rowData, props.uniqKey, null),
        });
      },
      [rowData, props.setParams],
    );

    return (
      <EtsTbodyTrTd>
        <EtsBootstrap.Button block onClick={handleClick}>Открыть историю</EtsBootstrap.Button>
      </EtsTbodyTrTd>
    );
  },
);

export default compose<TrTdServiceButtonShowActionLogProps, TrTdServiceButtonShowActionLogOwnProps>(
  connect<TrTdServiceButtonShowActionLogStateProps, TrTdServiceButtonShowActionLogDispatchProps, TrTdServiceButtonShowActionLogOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
    }),
  ),
  withSearch,
)(TrTdServiceButtonShowActionLog);
