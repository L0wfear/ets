import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { isEmpty } from 'utils/functions';
import Div from 'components/old/ui/Div';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';

const savePermissions = [
  waybillPermissions.update_closed,
  waybillPermissions.update,
  waybillPermissions.departure_and_arrival_values,
];

type IPropsWaybillFooter = {
  isCreating: boolean;
  isDraft: boolean;
  isClosed: boolean;
  isActive: boolean;
  canSave: boolean;
  canClose: boolean;
  canPrint: boolean;
  canGiveOutRead: boolean;
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
  isPermittedByKey: {
    refill: boolean;
    update: boolean;
    departure_and_arrival_values: boolean;
    update_closed: boolean;
  };
};

const message = 'Автоматическое обновление полей: Одометр.Выезд из гаража, Счетчик моточасов. Выезд из гаража, Счетчик моточасов оборудования. Выезд из гаража, Топливо.Выезд, из предыдущего, последнего по времени выдачи, закрытого ПЛ на указанное ТС';

const popoverHoverFocus = (
  <EtsBootstrap.Popover id="popover-trigger-hover-focus" title="Внимание!">
    {message}
  </EtsBootstrap.Popover>
);

class WaybillFooter extends React.Component<IPropsWaybillFooter> {
  private get isHasPermissionToEditWaybill(): boolean {
    const { isPermittedByKey } = this.props;

    return Boolean(isPermittedByKey.update
      || isPermittedByKey.update_closed
      || isPermittedByKey.refill
      || isPermittedByKey.departure_and_arrival_values);
  }
  private get isDisabledWaybillSubmitButton(): boolean {
    const { canSave } = this.props;
    return !(canSave && this.isHasPermissionToEditWaybill);
  }

  private get isHiddenWaybillSubmitButton(): boolean {
    return !this.isHasPermissionToEditWaybill;
  }

  public render(): JSX.Element {
    const { props } = this;
    const waybillSaveDropdownPrintToggleElement = (
      <React.Fragment>
        <EtsBootstrap.Glyphicon id="waybill-download-pdf" glyph="download-alt" /> {props.state.status === 'closed' || props.state.status === 'active' ? 'Просмотр' : 'Выдать'}
      </React.Fragment>
    );

    return (
      <EtsButtonsContainer>
        <Div hidden={!(props.isCreating || props.isDraft) || !props.isPermittedByKey.update}>
          <EtsBootstrap.OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverFocus}>
            <EtsBootstrap.Button id="waybill-refresh" onClick={props.refresh} disabled={isEmpty(props.state.car_id)}><EtsBootstrap.Glyphicon glyph="refresh" /></EtsBootstrap.Button>
          </EtsBootstrap.OverlayTrigger>
        </Div>
        <Div hidden={!props.isPermittedByKey.update} permissions={(props.state.status !== 'closed' && props.state.status !== 'active') ? waybillPermissions.plate : undefined}>
          <EtsButtonsContainer marginContainerX={0}>
            <EtsBootstrap.Dropdown
              id="waybill-print-dropdown_ptint"
              className="print"
              dropup
              disabled={!props.canPrint || !props.state.id}

              toggleElement={<EtsBootstrap.Glyphicon glyph="print" />}
            >
              <EtsBootstrap.DropdownMenu dropup>
                <EtsBootstrap.MenuItem id="print-plate_special" onSelect={props.handlePrintFromMiniButton} eventKey={'plate_bus'}>Форма №1 (автобус)</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem id="print-plate_truck" onSelect={props.handlePrintFromMiniButton} eventKey={'plate_truck'}>Форма №2 (грузовое ТС)</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem id="print-plate_car" onSelect={props.handlePrintFromMiniButton} eventKey={'plate_car'}>Форма №3 (легковое ТС)</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem id="print-plate_special" onSelect={props.handlePrintFromMiniButton} eventKey={'plate_special'}>Форма №4 (самоходная машина)</EtsBootstrap.MenuItem>
              </EtsBootstrap.DropdownMenu>
            </EtsBootstrap.Dropdown>
            <EtsBootstrap.Dropdown
              id="waybill-print-dropdown_save"
              className="pdf"
              dropup
              disabled={!props.canGiveOutRead}

              toggleElement={waybillSaveDropdownPrintToggleElement}
            >
              <EtsBootstrap.DropdownMenu dropup pullRight>
                <EtsBootstrap.MenuItem id="save-print-plate_special" onSelect={props.handlePrint.bind(null, props.state.status !== 'draft' && !props.isCreating)} eventKey={'plate_bus'}>Форма №1 (автобус)</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem id="save_print-plate_truck" onSelect={props.handlePrint.bind(null, props.state.status !== 'draft' && !props.isCreating)} eventKey={'plate_truck'}>Форма №2 (грузовое ТС)</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem id="save-print-plate_car" onSelect={props.handlePrint.bind(null, props.state.status !== 'draft' && !props.isCreating)} eventKey={'plate_car'}>Форма №3 (легковое ТС)</EtsBootstrap.MenuItem>
                <EtsBootstrap.MenuItem id="save-print-plate_special" onSelect={props.handlePrint.bind(null, props.state.status !== 'draft' && !props.isCreating)} eventKey={'plate_special'}>Форма №4 (самоходная машина)</EtsBootstrap.MenuItem>
              </EtsBootstrap.DropdownMenu>
            </EtsBootstrap.Dropdown>
          </EtsButtonsContainer>
        </Div>
        <EtsButtonsContainer marginContainerY={4.5} marginContainerX={0}>
          <Div
            permissions={savePermissions}
            className={'inline-block'}
            hidden={this.isHiddenWaybillSubmitButton}
          >
            <EtsBootstrap.Button id="waybill-submit" onClick={props.handleSubmit} disabled={this.isDisabledWaybillSubmitButton}>Сохранить</EtsBootstrap.Button>
          </Div>
          <Div permissions={waybillPermissions.update} className={'inline-block'} style={{ marginLeft: 4 }} hidden={props.state.status === 'closed' || props.state.status==='deleted' || !(props.formState.status && props.formState.status === 'active')}>
            <EtsBootstrap.Button id="close-waybill" onClick={() => props.handleClose(props.taxesControl)} disabled={!props.canClose}>Закрыть ПЛ</EtsBootstrap.Button>
          </Div>
        </EtsButtonsContainer>
      </EtsButtonsContainer>
    );
  }
}

export default WaybillFooter;
