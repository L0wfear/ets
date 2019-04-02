import * as React from 'react';
import { connect } from 'react-redux';
import { getListData, getHeaderData } from 'components/new/ui/registry/module/selectors-registry';
import { get } from 'lodash';
import { isNumber, isArray } from 'util';

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
import { getSessionState } from 'redux-main/reducers/selectors';
import { makeDate, getFormattedDateTime, getFormattedDateTimeWithSecond } from 'utils/dates';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

let lasPermissions = {};
let lastPermissionsArray = [];

const getPermissionsReadUpdate = (permission) => {
  if (lasPermissions !== permission) {
    lasPermissions = permission;

    lastPermissionsArray = [permission.read, permission.update];
  }

  return lastPermissionsArray;
};

class TrTbody extends React.Component<PropsTrTbody, StateTrTbody> {
  renderRow = ({ key, title, format, dashIfEmpty }, index) => {
    const { props } = this;

    const {
      rowData,
      registryKey,
    } = props;

    if (key === 'checkbox') {
      return (
        <TrTdCheckbox
          key={key}
          indexRow={props.indexRow}
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
        if (displayIf === displayIfContant.carActualAsuodsIdInParams) {
          const car_actual_asuods_id = getNumberValueFromSerch(this.props.match.params.car_actual_asuods_id);
          if (!car_actual_asuods_id) {
            return true;
          }
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

    if (props.handleClickOnRow) {
      props.handleClickOnRow(
        props.rowData,
      );
    } else {
      this.props.registryHandleClickOnRow(
        props.rowData,
      );
    }
  }

  handleDoubleClick: React.MouseEventHandler<HTMLTableRowElement> = (e) => {
    const { props } = this;
    if (props.isPermitted && props.buttons.includes(buttonsTypes.read)) {
      if (props.handleDoubleClickOnRow) {
        props.handleDoubleClickOnRow(
          props.rowData,
        );
      } else {
        this.props.setParams({
          [this.props.uniqKeyForParams]: get(props.rowData, this.props.uniqKey, null),
        });
      }
    }
  }

  render() {
    const { props } = this;
    return (
      <EtsTrTbody
        enable
        selected={props.rowData[props.uniqKey] === props.selectedUniqKey}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
      >
        { props.rowFields.map(this.renderRow) }
      </EtsTrTbody>
    );
  }
}

export default compose<PropsTrTbody, OwnPropsTrTbody>(
  withSearch,
  connect<StatePropsTrTbody, DipatchPropsTrTbody, OwnPropsTrTbody, ReduxState>(
    (state, { registryKey }) => ({
      STRUCTURES: getSessionStructuresOptions(state),
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      rowFields: getListData(state.registry, registryKey).meta.rowFields,
      permissions: getPermissionsReadUpdate(getListData(state.registry, registryKey).permissions), //  прокидывается в следующий компонент
      userData: getSessionState(state).userData,
      selectedUniqKey: get(getListData(state.registry, registryKey), ['data', 'selectedRow', getListData(state.registry, registryKey).data.uniqKey], null),
      buttons: getHeaderData(state.registry, registryKey).buttons,
    }),
    (dispatch, { registryKey }) => ({
      registryHandleClickOnRow: (rowData) => (
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
