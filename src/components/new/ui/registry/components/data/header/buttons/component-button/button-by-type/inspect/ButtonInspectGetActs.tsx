import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { saveData } from 'utils/functions';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type OwnProps = CommonTypesForButton & {
  id?: number;
};
type Props = OwnProps & WithSearchProps;

const ButtonInspectGetActs: React.FC<Props> = React.memo(
  (props) => {
    const {
      registryKey,
    } = props;

    const dispatch = etsUseDispatch();

    const currentSelectedRow = etsUseSelector(
      (state) => (
        getListData(state.registry, registryKey).data.selectedRow
      ),
    );

    const currentSelectedRowUniqKey = etsUseSelector(
      (state) => (
        get(
          getListData(state.registry, registryKey).data.selectedRow,
          getListData(state.registry, registryKey).data.uniqKey,
        ) || props.id
      ),
    );

    const currentCheckedRows = etsUseSelector(
      (state) => (
        getListData(state.registry, registryKey).data.checkedRows
      ),
    );

    const canGetAct = React.useMemo(
      () => {
        if (Object.values(currentCheckedRows).length) {
          return Object.keys(currentCheckedRows).some((elem) => (currentCheckedRows[elem]).status === 'completed');
        }
        if (Boolean(currentSelectedRowUniqKey)) {
          return get(currentSelectedRow, 'status', '') === 'completed';
        }
      }, [currentSelectedRowUniqKey, currentCheckedRows, currentSelectedRow],
    );

    const getActsDispatch = React.useCallback(async (inspectId) => {
      const response = await dispatch(inspectionActions.actionGetBlobActInspect(
        Number(inspectId),
        { page: props.registryKey },
      ));
      const blob = get(response, 'blob', null);
      const fileName = get(response, 'fileName', '');
      if (blob) {
        saveData(blob, fileName);
      }
    }, [props.registryKey]);

    const handleGetAct = React.useCallback(
      async () => {
        if (canGetAct) {
          if (Object.values(currentCheckedRows).length) {
            let hasError = false;
            Object.keys(currentCheckedRows).map( async (inspectId) => {
              try {
                if (currentCheckedRows[inspectId].status === 'completed') {
                  await getActsDispatch(inspectId);
                }
              } catch (error) {
                // tslint:disable-next-line:no-console
                console.error(`Ошибка при формировании Акта ${inspectId}: `, error);
                hasError = true;
              }
            });

            if (hasError) {
              global.NOTIFICATION_SYSTEM.notify('Ошибка при формировании Акта', 'error');
            }
          } else if (Boolean(currentSelectedRowUniqKey)) {
            if (get(currentSelectedRow, 'status', '') === 'completed') {
              await getActsDispatch(currentSelectedRow.id);
            }
          }
        }
      },
      [canGetAct, currentCheckedRows, currentSelectedRowUniqKey, currentSelectedRow],
    );

    return (
      <EtsBootstrap.Button disabled={!canGetAct} title={!canGetAct ? 'Сформировать акт(ы) можно только для проверок в статусе “завершена”' : ''} onClick={handleGetAct}>
        Сформировать акт(ы)
      </EtsBootstrap.Button>
    );
  },
);

export default withSearch<OwnProps>(ButtonInspectGetActs);
