import * as React from 'react';
import { get } from 'lodash';
import { isNumber, isArray } from 'util';

import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { makeDate, getFormattedDateTime, getFormattedDateTimeWithSecond } from 'components/@next/@utils/dates/dates';
import { AUTOBASE_REPAIR_STATUS } from 'redux-main/reducers/modules/autobase/actions_by_type/repair/status';
import { TIME_MEASURES } from 'constants/dictionary';
import { WAYBILL_STATUSES } from 'constants/statuses';
import { missionsStatusBySlag } from 'components/old/waybill/constant/table';
import SimpleLinkA from 'components/new/ui/simple_a/link';

import config from 'config';
import { CommontTdTiteProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/@types/commont';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import TdContainer, { TdContainerProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/inside_button/TdContainer';
import ExtFieldTd from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/ExtFieldTd';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import { getSomeUniqState } from 'redux-main/reducers/selectors';

const makeFormatedTitle = (rowData: CommontTdTiteProps['rowData'], fieldMeta: CommontTdTiteProps['fieldMeta'], payloadFormated) => {
  let value = rowData[fieldMeta.key];

  if ('format' in fieldMeta) {
    const { format } = fieldMeta;

    if (format === 'date') {
      value = value ? makeDate(value) : '-';
    }
    if (format === 'datetime') {
      value = value ? getFormattedDateTime(value) : '-';
    }
    if (format === 'datetimesecond') {
      value = value ? getFormattedDateTimeWithSecond(value) : '-';
    }
    if (format === 'boolean') {
      value = <input type="checkbox" disabled checked={!!value} />;
    }
    if (format === 'toFixed1') {
      value = isNumber(value) ? parseFloat(value.toString()).toFixed(2) : '';
    }
    if (format === 'toFixed2') {
      value = isNumber(value) ? parseFloat(value.toString()).toFixed(2) : '';
    }
    if (format === 'toFixed3') {
      value = isNumber(value) ? parseFloat(value.toString()).toFixed(2) : '';
    }
    if (format === 'array') {
      value = isArray(value) ? value.join(', ') : '';
    }
    if (format === 'array_of_object_name') {
      value = isArray(value) ? value.map(({ name }) => name).join(', ') : '';
    }

    if (format === 'link') {
      value = <SimpleLinkA href={`${__DEVELOPMENT__ ? config.url : '' }${rowData.url}`} title={rowData.name} download={rowData.name} target="_black"/>;
    }
    if (format === 'workOrNot') {
      value = value ? 'Работает' : 'Не работает';
    }
    if (format === 'yesOrNot') {
      value = value ? 'Да' : 'Нет';
    }
    if (format === 'road_accident_driver_fio') {
      const {
        driver_fio,
        employee_position_name,
      } = rowData;

      const drivers_license = get(rowData, 'drivers_license', '') || '';
      const special_license = get(rowData, 'special_license', '') || '';

      value = `${driver_fio} | ${employee_position_name} ${drivers_license ? `${drivers_license} ` : ''}${special_license}`;
    }
    if (format === 'AUTOBASE_REPAIR_STATUS') {
      value = get(AUTOBASE_REPAIR_STATUS, `${value}.name`, null) || '---';
    }
    if (format === 'TIME_MEASURES') {
      value = get(TIME_MEASURES, value, '-');
    }
    if (format === 'checkOrExpect') {
      value = value ? 'Проверено' : 'Ожидает проверки';
    }
    if (format === 'efficiencySource') {
      value = (
        value
        ? 'Справочник показателей норм на содержание ОДХ'
        : 'Реестр ОДХ'
      );
    }
    if (format === 'floor') {
      value = value ? Math.floor(value) : '';
    }
    if (format === 'waybill_all_missions_status') {
      value = get(missionsStatusBySlag, value, '');
    }
    if (format === 'waybill_status_name') {
      value = WAYBILL_STATUSES[value];
    }
    if (format === 'inspectionSelect') {
      const {
        inspectionConfig,
      } = payloadFormated;
      const getInspectionOptionsByKeyList = get( inspectionConfig, fieldMeta.key, null);
      if (getInspectionOptionsByKeyList) {
        const optionVal = getInspectionOptionsByKeyList.find((elem) => elem.value.toString() === value);
        value = optionVal ? optionVal.label : value;
      }
    }
  }

  if ('dashIfEmpty' in fieldMeta && fieldMeta.dashIfEmpty) {
    value = !value && value !== 0 ? '-' : value;
  }

  return value;
};

const DefaultTdTitle: React.FC<CommontTdTiteProps> = React.memo(
  (props) => {
    const inspectionConfig = etsUseSelector((reduxState) => get( getSomeUniqState(reduxState), `inspectionConfig`, null));
    const payloadFormated = {
      inspectionConfig,
    };
    const title = React.useMemo(
      () => makeFormatedTitle(props.rowData, props.fieldMeta, payloadFormated),
      [props.rowData, props.fieldMeta, payloadFormated, inspectionConfig, ],
    );
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const selectedRow = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);
    const isSelected = get(selectedRow, uniqKey) === props.rowData[uniqKey];

    const registryPermissions = etsUseSelector((state) => getListData(state.registry, props.registryKey).permissions);
    const isPermittedToUpdate = etsUseIsPermitted(registryPermissions.update);

    const extFieldIsRender = Boolean(props.fieldMeta.renderParams && isSelected && isPermittedToUpdate);

    const tdContainerProps: TdContainerProps = {
      id: props.id,
      registryKey: props.registryKey,
      value: title,
      isSelected,
      max_size_to_scroll: props.fieldMeta.max_size_to_scroll || 300,
    };

    return extFieldIsRender
      ? (
        <ExtFieldTd
          renderParams={props.fieldMeta.renderParams}
          registryKey={props.registryKey}
          metaKey={props.fieldMeta.key}
          indexRow={props.indexRow}
          tdContainerProps={tdContainerProps}
        />
      )
      : (
        <TdContainer {...tdContainerProps} />
      );
  },
);

export default DefaultTdTitle;
