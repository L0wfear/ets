import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as Dropdown from 'react-bootstrap/lib/Dropdown';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';
import * as Popover from 'react-bootstrap/lib/Popover';
import * as OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { isEmpty } from 'utils/functions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import DivForEnhance from 'components/ui/Div';
import permissions from 'components/waybill/config-data/permissions';
import {
  BtnGroupWrapper,
  DisplayFlexAlignCenter,
  BtnPart,
} from 'global-styled/global-styled';

const Div = withRequirePermissionsNew({})(DivForEnhance);

const savePermissions = [
  permissions.update_closed,
  permissions.update,
  permissions.departure_and_arrival_values,
];

interface IPropsWaybillFooter {
  isCreating: boolean;
  isDraft: boolean;
  canSave: boolean;
  canClose: boolean;
  formState: any;
  state: any;
  canEditIfClose: boolean;
  taxesControl: any;
  entity: string;
  refresh(): void;
  handleSubmit(): void;
  handlePrintFromMiniButton(): void;
  handleClose(taxes: any): void;
  handlePrint(is: boolean): void;
  message: string;
  isPermittedByKey: {
    update: boolean;
    departure_and_arrival_values: boolean;
  };
}

const message = 'Автоматическое обновление полей: Одометр.Выезд из гаража, Счетчик моточасов. Выезд из гаража, Счетчик моточасов оборудования. Выезд из гаража, Топливо.Выезд, из предыдущего, последнего по времени выдачи, закрытого ПЛ на указанное ТС';

const popoverHoverFocus = (
  <Popover id="popover-trigger-hover-focus" title="Внимание!">
   {message}
  </Popover>
);

class WaybillFooter extends React.Component<IPropsWaybillFooter, {}> {
  render() {
    const { props } = this;

    return (
      <DisplayFlexAlignCenter>
        <Div className={'inline-block'} style={{ marginRight: 5 }} hidden={!(props.isCreating || props.isDraft) || !props.isPermittedByKey.update}>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverFocus}>
          <Button id="waybill-refresh" onClick={props.refresh} disabled={isEmpty(props.state.car_id)}><Glyphicon glyph="refresh" /></Button>
          </OverlayTrigger>
        </Div>
        <Div hidden={!props.isPermittedByKey.update} className="inline-block" permissions={(props.state.status !== 'closed' && props.state.status !== 'active') ? permissions.plate : undefined}>
          <BtnGroupWrapper>
            <BtnPart>
              <Dropdown id="waybill-print-dropdown_ptint" className="print" dropup disabled={!props.canSave || !props.state.id} onSelect={props.handlePrintFromMiniButton}>
                <Dropdown.Toggle disabled={!props.canSave}>
                  <Glyphicon glyph="print" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem id="print-plate_special" eventKey={'plate_bus'}>Форма №1 (автобус)</MenuItem>
                  <MenuItem id="print-plate_truck" eventKey={'plate_truck'}>Форма №2 (грузовое ТС)</MenuItem>
                  <MenuItem id="print-plate_car" eventKey={'plate_car'}>Форма №3 (легковое ТС)</MenuItem>
                  <MenuItem id="print-plate_special" eventKey={'plate_special'}>Форма №4 (самоходная машина)</MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </BtnPart>
            <BtnPart>
              <Dropdown id="waybill-print-dropdown_save" className="pdf" dropup pullRight disabled={!props.canSave} onSelect={props.handlePrint.bind(null, props.state.status !== 'draft' && !props.isCreating)}>
                <Dropdown.Toggle disabled={!props.canSave}>
                  <Glyphicon id="waybill-download-pdf" glyph="download-alt" /> {props.state.status === 'closed' || props.state.status === 'active' ? 'Просмотр' : 'Выдать'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem id="save-print-plate_special" eventKey={'plate_bus'}>Форма №1 (автобус)</MenuItem>
                  <MenuItem id="save_print-plate_truck" eventKey={'plate_truck'}>Форма №2 (грузовое ТС)</MenuItem>
                  <MenuItem id="save-print-plate_car" eventKey={'plate_car'}>Форма №3 (легковое ТС)</MenuItem>
                  <MenuItem id="save-print-plate_special" eventKey={'plate_special'}>Форма №4 (самоходная машина)</MenuItem>
                </Dropdown.Menu>
              </Dropdown>&nbsp;
            </BtnPart>
          </BtnGroupWrapper>
        </Div>
        <Div
          permissions={savePermissions}
          className={'inline-block'}
          hidden={(props.state.status === 'closed' && !props.canEditIfClose) || (!props.isPermittedByKey.update && props.isPermittedByKey.departure_and_arrival_values && props.state.status !== 'active')}
        >
          <Button id="waybill-submit" onClick={props.handleSubmit} disabled={!props.canSave && !props.state.canEditIfClose}>Сохранить</Button>
        </Div>
        <Div permissions={permissions.update} className={'inline-block'} style={{ marginLeft: 4 }} hidden={props.state.status === 'closed' || !(props.formState.status && props.formState.status === 'active')}>
          <Button id="close-waybill" onClick={() => props.handleClose(props.taxesControl)} disabled={!props.canClose}>Закрыть ПЛ</Button>
        </Div>
      </DisplayFlexAlignCenter>
    );
  }
}

export default WaybillFooter;
