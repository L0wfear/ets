import * as React from 'react';
import { useSelector } from 'react-redux';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ReduxState } from 'redux-main/@types/state';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { inspect_types } from './constant';
import { getSessionState } from 'redux-main/reducers/selectors';
import inspectActScanPermissions from './forms/show_acts/registry/permissions';

type Props = {
  registryKey: string;
  id?: number;
} & WithSearchProps;

const ButtonInspectShowActs: React.FC<Props> = React.memo(
  (props) => {
    const {
      registryKey,
    } = props;

    const isPermittedUpdate = useSelector(
      (state: ReduxState) => getSessionState(state).userData.permissionsSet.has(inspectActScanPermissions.read),
    );

    const currentSelectedRowUniqKey = useSelector(
      (state: ReduxState) => (
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

    return React.useMemo(
      () => isPermittedUpdate && (
        <EtsBootstrap.Button disabled={!Boolean(currentSelectedRowUniqKey)} onClick={handleClick}>
          <EtsBootstrap.Glyphicon glyph="list-alt" /> Скан-копия акта
        </EtsBootstrap.Button>
      ),
      [
        isPermittedUpdate,
        currentSelectedRowUniqKey,
        handleClick,
      ],
    );
  },
);

export default withSearch(ButtonInspectShowActs);
