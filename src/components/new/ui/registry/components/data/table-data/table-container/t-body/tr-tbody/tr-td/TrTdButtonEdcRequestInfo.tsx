import * as React from 'react';
import {
  connect,
  // HandleThunkActionCreator,
} from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
// import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
// import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import {
  GlyphiconContainer32,
  // EtsTbodyTrTdMisionData,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

import { get } from 'lodash';

// import { ButtonGroupWrapperMargin } from 'global-styled/global-styled';

type TrTdButtonEdcRequestInfoActionsStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
};

type TrTdButtonEdcRequestInfoDispatchProps = {
};

type TrTdButtonEdcRequestInfoOwnProps = {
  registryKey: string;
  rowData: EdcRequest;
};

type TrTdButtonEdcRequestInfoMergedProps = (
  TrTdButtonEdcRequestInfoActionsStateProps
  & TrTdButtonEdcRequestInfoDispatchProps
  & TrTdButtonEdcRequestInfoOwnProps
) & WithSearchProps & {
  isPermitted: boolean;
};

type TrTdButtonEdcRequestInfoProps = TrTdButtonEdcRequestInfoMergedProps;

const TrTdButtonEdcRequestInfo: React.FC<TrTdButtonEdcRequestInfoProps> = React.memo(
  (props) => {

    const { rowData } = props;
    // console.log('TrTdButtonEdcRequestInfo props === ', props);

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
        {
          rowData.rework ?
          (
            <GlyphiconContainer32 onClick={ handleClick } notFull={true}>
              <EtsBootstrap.Glyphicon glyph="info-sign" />
            </GlyphiconContainer32>
          ) : (
            ''
          )
        }
      </EtsTbodyTrTd>
    );
  },
);

export default compose<TrTdButtonEdcRequestInfoProps, TrTdButtonEdcRequestInfoOwnProps>(
  connect<TrTdButtonEdcRequestInfoActionsStateProps, TrTdButtonEdcRequestInfoDispatchProps, TrTdButtonEdcRequestInfoOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
    }),
  ),
  withSearch,
)(TrTdButtonEdcRequestInfo);
