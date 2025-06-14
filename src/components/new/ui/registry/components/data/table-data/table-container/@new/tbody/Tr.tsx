import * as React from 'react';
import { get } from 'lodash';

import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData, getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { registrySelectRow, registrySetRowIsOpen } from 'components/new/ui/registry/module/actions-registy';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import Td from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/Td';
import { makePayloadToParamsForRead } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/utils';
import { isPermittedUpdateCarContidion } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/utils';
import { isNullOrUndefined } from 'util';

export const registryIsPermitedByKey: Record<string, (registryKey: string) => Record<'isPermittedToUpdate' | 'isPermittedToUpdateClose', boolean> & { actionType: string; }> = {
  InspectCarsConditionsCarsExtendedRegistry: isPermittedUpdateCarContidion,
};

type OwnProps = {
  registryKey: string;
  indexRow: number;
  rowData: ValuesOf<OneRegistryData<any>['list']['processed']['processedArray']>;
};
type Props = OwnProps & WithSearchProps;

const TrHead: React.FC<Props> = React.memo(
  (props) => {
    const {
      indexRow,
      rowData,
    } = props;

    const dispatch = etsUseDispatch();

    const checkedRows = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.checkedRows);
    const selectedRow = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);

    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const uniqKeyForSelect = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForSelect);
    const disableDoubleClick = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.disableDoubleClick);
    const withoutWithSearch = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.withoutWithSearch);
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForParams);
    const key = uniqKeyForSelect || uniqKey;
    const row_double_click = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.row_double_click);
    const selected_row_in_params = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.selected_row_in_params);
    const permissions = etsUseSelector((state) => getListData(state.registry, props.registryKey).permissions);
    const buttons = etsUseSelector((state) => getHeaderData(state.registry, props.registryKey).buttons); // надо переделать
    const rowFields = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.rowFields);

    const isPermitted = (
      etsUseIsPermitted(permissions.create)
      || etsUseIsPermitted(permissions.read)
    );
    const checkData = checkedRows[key];
    const isSelected = get(selectedRow, key) === rowData[key] && !isNullOrUndefined(get(selectedRow, key) && !isNullOrUndefined(rowData[key]));

    const handleDoubleClick = React.useCallback(
      () => {
        if (isPermitted && !disableDoubleClick) {
          if (withoutWithSearch) {
            dispatch(registrySetRowIsOpen(props.registryKey, true));
            return;
          }
          const buttonReadData = buttons.find(({ type }) => type === buttonsTypes.read);
          if (buttonReadData && row_double_click) {
            const changeObj = makePayloadToParamsForRead(
              buttonReadData,
              rowData,
              uniqKeyForParams,
              uniqKey,
            );
            props.setParams(changeObj);
          } else if (row_double_click) {
            props.setParams({
              [uniqKeyForParams]: get(rowData, uniqKey, null),
            });
          }
        }
      },
      [
        isPermitted,
        buttons,
        buttonsTypes,
        row_double_click,
        props.setParams,
        uniqKeyForParams,
        uniqKey,
        rowData,
        disableDoubleClick,
        withoutWithSearch,
      ],
    );

    const registryIsPermitedFuction = get(registryIsPermitedByKey, props.registryKey);
    let registryIsPermitedFuctionResult: ReturnType<typeof registryIsPermitedFuction> = null;
    if (registryIsPermitedFuction) {
      registryIsPermitedFuctionResult = registryIsPermitedFuction(props.registryKey);
    }

    const handleClick = React.useCallback(
      () => {
        if (selected_row_in_params) {
          handleDoubleClick();
        } else {
          dispatch(
            registrySelectRow(
              props.registryKey,
              props.rowData,
              registryIsPermitedFuctionResult,
            ),
          );
        }
      },
      [selected_row_in_params, handleDoubleClick, registryIsPermitedFuctionResult],
    );

    return (
      <React.Fragment>
        <EtsBootstrap.Grid.GridBootstrapTbody.Tr
          id={`${props.registryKey}.${rowData[uniqKey]}`}
          enable
          isSelected={isSelected}

          rowData={rowData}
          checkData={checkData}

          onClick={handleClick}
          onDoubleClick={handleDoubleClick}

          registryKey={props.registryKey}
        >
          {
            rowFields.map((fieldMeta) => (
              <Td
                key={fieldMeta.key}
                rowData={rowData}
                fieldMeta={fieldMeta}
                registryKey={props.registryKey}
                indexRow={indexRow}
              />
            ))
          }

        </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
        {
          rowData.is_open && rowData.children.map((childRowData, childIndexRow) => (
            <TrConnected
              key={childRowData[uniqKey]}
              rowData={childRowData}
              registryKey={props.registryKey}
              indexRow={childIndexRow}
            />
          ))
        }
      </React.Fragment>
    );
  },
);

const TrConnected = withSearch<OwnProps>(TrHead);

export default TrConnected;
