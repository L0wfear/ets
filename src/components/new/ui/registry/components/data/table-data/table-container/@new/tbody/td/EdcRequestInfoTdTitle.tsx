import * as React from 'react';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

type OwnProps = CommontTdTiteProps;
type Props = OwnProps & WithSearchProps;

const EdcRequestInfoTdTitle: React.FC<Props> = React.memo(
  (props) => {
    const { rowData } = props;
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForParams);
    const uniqValue = rowData[uniqKey] || null;

    const handleClick = React.useCallback(
      async () => {
        props.setParams({
          [uniqKeyForParams]: uniqValue,
          type: buttonsTypes.edc_request_info,
        });
      },
      [rowData, buttonsTypes, uniqKeyForParams, uniqValue, props.setParams],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td alignCenter>
        {
          rowData.rework && (
            <EtsBootstrap.Glyphicon onClick={ handleClick } glyph="info-sign" fontSize="32px" color={UiConstants.colorError} />
          )
        }
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default withSearch<OwnProps>(EdcRequestInfoTdTitle);
