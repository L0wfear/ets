import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { get } from 'lodash';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

type TrTdButtonShowEdcCommentsStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  permissions: string | boolean;
};
type TrTdButtonShowEdcCommentsDispatchProps = {
};
type TrTdButtonShowEdcCommentsOwnProps = {
  registryKey: string;
  rowData: Tire;
};
type TrTdButtonShowEdcCommentsMergedProps = (
  TrTdButtonShowEdcCommentsStateProps
  & TrTdButtonShowEdcCommentsDispatchProps
  & TrTdButtonShowEdcCommentsOwnProps
) & WithSearchProps;

type TrTdButtonShowEdcCommentsProps = TrTdButtonShowEdcCommentsMergedProps;

const TrTdButtonShowEdcComments: React.FC<TrTdButtonShowEdcCommentsProps> = React.memo(
  (props) => {
    const { rowData } = props;

    const handleClick = React.useCallback(
      () => {
        props.setParams({
          [props.uniqKeyForParams]: get(rowData, props.uniqKey, null),
          type: buttonsTypes.edc_request_comments,
        });
      },
      [rowData],
    );

    return (
      <EtsTbodyTrTd>
        <EtsBootstrap.Button block onClick={handleClick}>
          <EtsBootstrap.Glyphicon glyph="envelope" />
        </EtsBootstrap.Button>
      </EtsTbodyTrTd>
    );
  },
);

export default compose<TrTdButtonShowEdcCommentsProps, TrTdButtonShowEdcCommentsOwnProps>(
  connect<TrTdButtonShowEdcCommentsStateProps, TrTdButtonShowEdcCommentsDispatchProps, TrTdButtonShowEdcCommentsOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      permissions: getListData(state.registry, registryKey).permissions.create, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  withSearch,
)(TrTdButtonShowEdcComments);
