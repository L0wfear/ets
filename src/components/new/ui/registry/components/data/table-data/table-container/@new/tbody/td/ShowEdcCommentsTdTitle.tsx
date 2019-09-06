import * as React from 'react';

import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = CommontTdTiteProps;
type Props = OwnProps & WithSearchProps;

const ShowEdcCommentsTdTitle: React.FC<Props> = React.memo(
  (props) => {
    const { rowData } = props;
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForParams);
    const uniqValue = rowData[uniqKey] || null;

    const handleClick = React.useCallback(
      () => {
        props.setParams({
          [uniqKeyForParams]: uniqValue,
          type: buttonsTypes.edc_request_comments,
        });
      },
      [rowData, uniqKeyForParams, uniqValue, buttonsTypes],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td id={props.id}>
        <EtsBootstrap.Button block onClick={handleClick}>
          <EtsBootstrap.Glyphicon glyph="envelope" />
        </EtsBootstrap.Button>
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default withSearch<OwnProps>(ShowEdcCommentsTdTitle);
