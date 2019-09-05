import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { inspect_types } from './constant';
import { getSessionState } from 'redux-main/reducers/selectors';
import inspectActScanPermissions from './forms/show_acts/registry/permissions';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type OwnProps = CommonTypesForButton & {
  id?: number;
};
type Props = OwnProps & WithSearchProps;

const ButtonInspectShowActs: React.FC<Props> = React.memo(
  (props) => {
    const {
      registryKey,
    } = props;

    const isPermittedUpdate = etsUseSelector(
      (state) => getSessionState(state).userData.permissionsSet.has(inspectActScanPermissions.read),
    );

    const currentSelectedRowUniqKey = etsUseSelector(
      (state) => (
        get(
          getListData(state.registry, registryKey).data.selectedRow,
          getListData(state.registry, registryKey).data.uniqKey,
        ) || props.id
      ),
    );

    const handleClick = React.useCallback(
      () => {
        if (currentSelectedRowUniqKey) {
          props.setDataInSearch({
            [inspect_types.inspect_show_acts]: currentSelectedRowUniqKey,
          });
        }
      },
      [currentSelectedRowUniqKey, props.setDataInSearch, props.searchState],
    );

    return isPermittedUpdate && (
      <EtsBootstrap.Button disabled={!Boolean(currentSelectedRowUniqKey)} onClick={handleClick}>
        <EtsBootstrap.Glyphicon glyph="list-alt" /> Скан-копия акта
      </EtsBootstrap.Button>
    );
  },
);

export default withSearch<OwnProps>(ButtonInspectShowActs);
