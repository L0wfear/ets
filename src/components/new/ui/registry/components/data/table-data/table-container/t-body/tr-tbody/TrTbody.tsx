import * as React from 'react';
import { connect } from 'react-redux';
import { getListData, getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { get } from 'lodash';
import { isNumber, isArray, isNullOrUndefined } from 'util';

import TrTd from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/TrTd';
import TrTdCheckbox from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/TrTdCheckbox';
import TrTdEnumerated from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/TrTdEnumerated';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

import {
  StatePropsTrTbody,
  DipatchPropsTrTbody,
  OwnPropsTrTbody,
  PropsTrTbody,
  StateTrTbody,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/TrTbody.h';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import { registrySelectRow } from 'components/new/ui/registry/module/actions-registy';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { getSessionState, getRegistryState } from 'redux-main/reducers/selectors';
import { makeDate, getFormattedDateTime, getFormattedDateTimeWithSecond } from 'utils/dates';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { AUTOBASE_REPAIR_STATUS } from 'redux-main/reducers/modules/autobase/actions_by_type/repair/status';
import { TIME_MEASURES } from 'constants/dictionary';
import TrTdButtonCloneTire from './tr-td/TrTdButtonCloneTire';
import TrTdButtonShowMissionInfo from './tr-td/TrTdButtonShowMissionInfo';
import TrTdIsOpen from './tr-td/TrTdIsOpen';
import TrTdButtonCompanyStructureActions from './tr-td/TrTdButtonCompanyStructureActions';
import { WAYBILL_STATUSES } from 'constants/statuses';
import { missionsStatusBySlag } from 'components/waybill/constant/table';
import TrTdButtonServicesActionsOnOff from './tr-td/TrTdButtonServicesActionsOnOff';
import TrTdServiceFiles from './tr-td/TrTdServiceFiles';
import TrTdServiceButtonShowActionLog from './tr-td/TrTdServiceButtonShowActionLog';
import TrTdButtonEdcRequestInfo from './tr-td/TrTdButtonEdcRequestInfo';
import { validatePermissions } from 'components/util/RequirePermissionsNewRedux';
import TrTdButtonShowImgButton from './tr-td/TrTdButtonShowImgButton';
import TrTdButtonShowEdcComments from './tr-td/TrTdButtonShowEdcComments';

let lasPermissions = {};
let lastPermissionsArray = [];

const getPermissionsReadUpdate = (permission) => {
  if (lasPermissions !== permission) {
    lasPermissions = permission;

    lastPermissionsArray = [permission.read, permission.update];
  }

  return lastPermissionsArray;
};

class TrTbody extends React.PureComponent<PropsTrTbody, StateTrTbody> {
  renderRow = ({ key, title, format, dashIfEmpty, displayIfPermission }, index) => {
    const { props } = this;

    const {
      rowData,
      registryKey,
    } = props;

    const permissionsSet = get(props, 'userData.permissionsSet', new Set());
    if ( !isNullOrUndefined(displayIfPermission) ) {
      if (!validatePermissions(displayIfPermission, permissionsSet)) {
        return null;
      }
    }

    if (key === 'checkbox') {
      return (
        <TrTdCheckbox
          key={key}
          registryKey={registryKey}
          rowData={props.rowData}
        />
      );
    }

    if (key === 'enumerated') {
      return (
        <TrTdEnumerated
          key={key}
          indexRow={props.indexRow}
          registryKey={registryKey}
        />
      );
    }

    if (key === 'is_open') {
      return (
        <TrTdIsOpen
          key={key}
          rowData={props.rowData}
        />
      );
    }

    if (key === 'buttonCloneTire') {
      return (
        <TrTdButtonCloneTire
          key={key}
          registryKey={registryKey}
          rowData={props.rowData}
        />
      );
    }

    if (key === 'show_file_list') {
      return (
        <TrTdButtonShowImgButton
          key={key}
          registryKey={registryKey}
          rowData={props.rowData}
        />
      );
    }

    if (key === 'show_edc_comments') {
      return (
        <TrTdButtonShowEdcComments
          key={key}
          registryKey={registryKey}
          rowData={props.rowData}
        />
      );
    }

    if (key === 'showMissionInfo') {
      return (
        <TrTdButtonShowMissionInfo
          key={key}
          registryKey={registryKey}
          rowData={props.rowData}
        />
      );
    }

    if (key === 'company_structure_actions') {
      return (
        <TrTdButtonCompanyStructureActions
          key={key}
          registryKey={registryKey}
          rowData={props.rowData}
        />
      );
    }

    if (key === 'services_actions_on_off') {
      return (
        <TrTdButtonServicesActionsOnOff
          key={key}
          registryKey={registryKey}
          rowData={props.rowData}
        />
      );
    }

    if (key === 'service_files') {
      return (
        <TrTdServiceFiles
          key={key}
          registryKey={registryKey}
          rowData={props.rowData}
        />
      );
    }

    if (key === 'button_show_action_log') {
      return (
        <TrTdServiceButtonShowActionLog
          key={key}
          registryKey={registryKey}
          rowData={props.rowData}
        />
      );
    }

    if (key === 'edc_request_info') {
      return (
        <TrTdButtonEdcRequestInfo
          key={key}
          registryKey={registryKey}
          rowData={props.rowData}
        />
      );
    }

    let formatedTitle = title;

    if (isArray(title)) {
      formatedTitle = title.reduce((filtredTitle, titleSomeValue) => {
        const { displayIf } = titleSomeValue;

        if (displayIf === displayIfContant.isKgh && this.props.userData.isKgh) {
          return true;
        }
        if (displayIf === displayIfContant.isOkrug && this.props.userData.isOkrug) {
          return true;
        }
        if (displayIf === displayIfContant.lenghtStructureMoreOne && this.props.STRUCTURES.length) {
          return true;
        }
        return filtredTitle;
      }, null);
    }

    if (!formatedTitle) {
      return null;
    }

    let value = rowData[key];

    if (format) {
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
    }

    if (dashIfEmpty) {
      value = !value && value !== 0 ? '-' : value;
    }

    return (
      <TrTd
        key={key}
        metaKey={key}
        value={value}
        rowData={rowData}
        registryKey={registryKey}
      />
    );
  }

  handleClick: React.MouseEventHandler<HTMLTableRowElement> = () => {
    const { props } = this;
    props.registrySelectRow(
      props.rowData,
    );
  }

  handleDoubleClick: React.MouseEventHandler<HTMLTableRowElement> = (e) => {
    const { props } = this;
    if (props.isPermitted && (props.buttons.includes(buttonsTypes.read) || props.row_double_click)) {
      this.props.setParams({
        [this.props.uniqKeyForParams]: get(props.rowData, this.props.uniqKey, null),
      });
    }
  }

  render() {
    const { props } = this;

    const children = get(props, 'rowData.children', []);

    return (
      <React.Fragment>
        <EtsTrTbody
          enable
          selected={props.rowData[props.uniqKey] === props.selectedUniqKey}
          onClick={this.handleClick}
          onDoubleClick={this.handleDoubleClick}
          rowData={this.props.rowData}
          checkData={this.props.checkData}
        >
          { props.rowFields.map(this.renderRow) }
        </EtsTrTbody>
        {
          props.rowData.is_open && children.map((childRowData, childIndexRow) => (
            <TrTbodyConnected
              key={childRowData[props.uniqKey]}
              rowData={childRowData}
              registryKey={props.registryKey}
              indexRow={childIndexRow}
            />
          ))
        }
      </React.Fragment>
    );
  }
}

const TrTbodyConnected = compose<PropsTrTbody, OwnPropsTrTbody>(
  withSearch,
  connect<StatePropsTrTbody, DipatchPropsTrTbody, OwnPropsTrTbody, ReduxState>(
    (state, { registryKey, rowData }) => ({
      STRUCTURES: getSessionStructuresOptions(state),
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      rowFields: getListData(state.registry, registryKey).meta.rowFields,
      permissions: getPermissionsReadUpdate(getListData(state.registry, registryKey).permissions), //  прокидывается в следующий компонент
      userData: getSessionState(state).userData,
      selectedUniqKey: get(getListData(state.registry, registryKey), ['data', 'selectedRow', getListData(state.registry, registryKey).data.uniqKey], null),
      buttons: getHeaderData(state.registry, registryKey).buttons,
      row_double_click: getListData(getRegistryState(state), registryKey).meta.row_double_click,
      checkData: get(getListData(state.registry, registryKey).data.checkedRows, rowData[getListData(state.registry, registryKey).data.uniqKey], false),
    }),
    (dispatch, { registryKey }) => ({
      registrySelectRow: (rowData) => (
        dispatch(
          registrySelectRow(
            registryKey,
            rowData,
          ),
        )
      ),
    }),
  ),
  withRequirePermissionsNew({
    withIsPermittedProps: true,
  }),
)(TrTbody);

export default TrTbodyConnected;
