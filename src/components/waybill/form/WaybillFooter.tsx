import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { isEmpty } from 'utils/functions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import DivForEnhance from 'components/ui/Div';
import {
  BtnGroupWrapper,
  DisplayFlexAlignCenterFooterForm,
  BtnPart,
} from 'global-styled/global-styled';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';

const Div = withRequirePermissionsNew({})(DivForEnhance);

const savePermissions = [
  waybillPermissions.update_closed,
  waybillPermissions.update,
  waybillPermissions.departure_and_arrival_values,
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
  <EtsBootstrap.Popover id="popover-trigger-hover-focus" title="Внимание!">
   {message}
  </EtsBootstrap.Popover>
);

class WaybillFooter extends React.Component<IPropsWaybillFooter, {}> {
  render() {
    const { props } = this;

    return (
      <DisplayFlexAlignCenterFooterForm>
        <Div className={'inline-block'} style={{ marginRight: 5 }} hidden={!(props.isCreating || props.isDraft) || !props.isPermittedByKey.update}>
          <EtsBootstrap.OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverFocus}>
            <EtsBootstrap.Button id="waybill-refresh" onClick={props.refresh} disabled={isEmpty(props.state.car_id)}><EtsBootstrap.Glyphicon glyph="refresh" /></EtsBootstrap.Button>
          </EtsBootstrap.OverlayTrigger>
        </Div>
        <Div hidden={!props.isPermittedByKey.update} className="inline-block" permissions={(props.state.status !== 'closed' && props.state.status !== 'active') ? waybillPermissions.plate : undefined}>
          <BtnGroupWrapper>
            <BtnPart>
              <EtsBootstrap.Dropdown id="waybill-print-dropdown_ptint" className="print" dropup disabled={!props.canSave || !props.state.id} onSelect={props.handlePrintFromMiniButton}>
                <EtsBootstrap.DropdownToggle disabled={!props.canSave}>
                  <EtsBootstrap.Glyphicon glyph="print" />
                </EtsBootstrap.DropdownToggle>
                <EtsBootstrap.DropdownMenu>
                  <EtsBootstrap.MenuItem id="print-plate_special" eventKey={'plate_bus'}>Форма №1 (автобус)</EtsBootstrap.MenuItem>
                  <EtsBootstrap.MenuItem id="print-plate_truck" eventKey={'plate_truck'}>Форма №2 (грузовое ТС)</EtsBootstrap.MenuItem>
                  <EtsBootstrap.MenuItem id="print-plate_car" eventKey={'plate_car'}>Форма №3 (легковое ТС)</EtsBootstrap.MenuItem>
                  <EtsBootstrap.MenuItem id="print-plate_special" eventKey={'plate_special'}>Форма №4 (самоходная машина)</EtsBootstrap.MenuItem>
                </EtsBootstrap.DropdownMenu>
              </EtsBootstrap.Dropdown>
            </BtnPart>
            <BtnPart>
              <EtsBootstrap.Dropdown id="waybill-print-dropdown_save" className="pdf" dropup pullRight disabled={!props.canSave} onSelect={props.handlePrint.bind(null, props.state.status !== 'draft' && !props.isCreating)}>
                <EtsBootstrap.DropdownToggle disabled={!props.canSave}>
                  <EtsBootstrap.Glyphicon id="waybill-download-pdf" glyph="download-alt" /> {props.state.status === 'closed' || props.state.status === 'active' ? 'Просмотр' : 'Выдать'}
                </EtsBootstrap.DropdownToggle>
                <EtsBootstrap.DropdownMenu>
                  <EtsBootstrap.MenuItem id="save-print-plate_special" eventKey={'plate_bus'}>Форма №1 (автобус)</EtsBootstrap.MenuItem>
                  <EtsBootstrap.MenuItem id="save_print-plate_truck" eventKey={'plate_truck'}>Форма №2 (грузовое ТС)</EtsBootstrap.MenuItem>
                  <EtsBootstrap.MenuItem id="save-print-plate_car" eventKey={'plate_car'}>Форма №3 (легковое ТС)</EtsBootstrap.MenuItem>
                  <EtsBootstrap.MenuItem id="save-print-plate_special" eventKey={'plate_special'}>Форма №4 (самоходная машина)</EtsBootstrap.MenuItem>
                </EtsBootstrap.DropdownMenu>
              </EtsBootstrap.Dropdown>&nbsp;
            </BtnPart>
          </BtnGroupWrapper>
        </Div>
        <Div
          permissions={savePermissions}
          className={'inline-block'}
          hidden={(props.state.status === 'closed' && !props.canEditIfClose) || (!props.isPermittedByKey.update && props.isPermittedByKey.departure_and_arrival_values && props.state.status !== 'active')}
        >
          <EtsBootstrap.Button id="waybill-submit" onClick={props.handleSubmit} disabled={!props.canSave && !props.state.canEditIfClose}>Сохранить</EtsBootstrap.Button>
        </Div>
        <Div permissions={waybillPermissions.update} className={'inline-block'} style={{ marginLeft: 4 }} hidden={props.state.status === 'closed' || !(props.formState.status && props.formState.status === 'active')}>
          <EtsBootstrap.Button id="close-waybill" onClick={() => props.handleClose(props.taxesControl)} disabled={!props.canClose}>Закрыть ПЛ</EtsBootstrap.Button>
        </Div>
      </DisplayFlexAlignCenterFooterForm>
    );
  }
}

export default WaybillFooter;
