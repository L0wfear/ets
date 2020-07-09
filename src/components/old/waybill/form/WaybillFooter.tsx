import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { isEmpty } from 'utils/functions';
import Div from 'components/old/ui/Div';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { OverlayTriggerConfig } from 'components/new/ui/@bootstrap/09-dropdown/EtsDropdown';

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
  isDelete: boolean;
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

const WaybillFooter: React.FC<IPropsWaybillFooter> = (props) => {
  const isHasPermissionToEditWaybill = Boolean(
    props.isPermittedByKey.update
      || props.isPermittedByKey.update_closed
      || props.isPermittedByKey.refill
      || props.isPermittedByKey.departure_and_arrival_values
  );

  const isDisabledWaybillSubmitButton = !((props.canSave || props.isDelete) && isHasPermissionToEditWaybill);

  const isHiddenWaybillSubmitButton = Boolean(!isHasPermissionToEditWaybill);

  const waybillSaveDropdownPrintToggleElement = (
    <React.Fragment>
      <EtsBootstrap.Glyphicon id="waybill-download-pdf" glyph="download-alt" /> {props.state.status === 'closed' || props.state.status === 'active' ? 'Просмотр' : 'Выдать'}
    </React.Fragment>
  );

  const isOdometrAndMotohours = props.state.is_edited_odometr && props.state.is_edited_motohours;
  const isOdometr = props.state.is_edited_odometr;
  const isMotohours = props.state.is_edited_motohours;
  const isMotohoursEquip = props.state.is_edited_motohours_equip;

  const message = React.useMemo(() => {
    return `Автоматическое обновление полей из предыдущего, последнего по времени выдачи, закрытого ПЛ на указанное ТС: в блоке “Транспортное средство”: 
      ${
  isOdometrAndMotohours
    ? ''
    : isOdometr
      ? ' Выезд из гаража (Счетчик моточасов), '
      : isMotohours
        ? ' Выезд из гаража (Одометр), '
        : ' Выезд из гаража (Одометр/Счетчик моточасов), '
}Выезд (Топливо); в блоке “Спецоборудование”: ${
  isMotohoursEquip
    ? ''
    : ' Выезд из гаража (Счетчик моточасов оборудования), '
}Выезд (Топливо).`;
  }, [isOdometrAndMotohours, isOdometr, isMotohours, isMotohoursEquip]);

  const messageForSavePrint = React.useMemo(() => {
    return `При выдаче ПЛ будут автоматически обновлены поля из предыдущего, последнего по времени выдачи, закрытого ПЛ на указанное ТС: в блоке “Транспортное средство”: 
      ${
  isOdometrAndMotohours
    ? ''
    : isOdometr
      ? ' Выезд из гаража (Счетчик моточасов), '
      : isMotohours
        ? ' Выезд из гаража (Одометр), '
        : ' Выезд из гаража (Одометр/Счетчик моточасов), '
}Выезд (Топливо); в блоке “Спецоборудование”: ${
  isMotohoursEquip
    ? ''
    : ' Выезд из гаража (Счетчик моточасов оборудования), '
}Выезд (Топливо).`;
  }, [isOdometrAndMotohours, isOdometr, isMotohours, isMotohoursEquip]);

  const popoverHoverFocus = (
    <EtsBootstrap.Popover id="popover-trigger-hover-focus" title="Внимание!">
      {message}
    </EtsBootstrap.Popover>
  );

  const popoverForSavePrint = (
    <EtsBootstrap.Popover id="popover-for-save-print" title="Внимание!">
      {messageForSavePrint}
    </EtsBootstrap.Popover>
  );

  const savePrintOverlayTriggerConfig: OverlayTriggerConfig = {
    triger: ['hover', 'focus', 'click'],
    placement: 'top',
    overlay: popoverForSavePrint,
  };

  return (
    <EtsButtonsContainer>
      <Div hidden={!(props.isCreating || props.isDraft) || !props.isPermittedByKey.update}>
        <EtsButtonsContainer>
          <EtsBootstrap.OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={popoverHoverFocus}
          >
            <EtsBootstrap.Button id="waybill-refresh" onClick={props.refresh} disabled={isEmpty(props.state.car_id)}>
              <EtsBootstrap.Glyphicon glyph="refresh" />
            </EtsBootstrap.Button>
          </EtsBootstrap.OverlayTrigger>
        </EtsButtonsContainer>
      </Div>
      <Div hidden={!props.isPermittedByKey.update} permissions={
        props.state.status !== 'closed' && props.state.status !== 'active'
          ? waybillPermissions.plate
          : undefined
      }
      >
        <EtsButtonsContainer marginContainerX={0}>
          <EtsBootstrap.Dropdown id="waybill-print-dropdown_ptint" className="print" dropup disabled={!props.canPrint || !props.state.id}
            toggleElement={<EtsBootstrap.Glyphicon glyph="print" />}
          >
            <EtsBootstrap.DropdownMenu dropup>
              <EtsBootstrap.MenuItem id="print-plate_special" onSelect={props.handlePrintFromMiniButton} eventKey={'plate_bus'}>
                Форма №1 (автобус)
              </EtsBootstrap.MenuItem>
              <EtsBootstrap.MenuItem id="print-plate_truck" onSelect={props.handlePrintFromMiniButton} eventKey={'plate_truck'}>
                Форма №2 (грузовое ТС)
              </EtsBootstrap.MenuItem>
              <EtsBootstrap.MenuItem id="print-plate_car" onSelect={props.handlePrintFromMiniButton} eventKey={'plate_car'}>
                Форма №3 (легковое ТС)
              </EtsBootstrap.MenuItem>
              <EtsBootstrap.MenuItem id="print-plate_special" onSelect={props.handlePrintFromMiniButton} eventKey={'plate_special'}>
                Форма №4 (самоходная машина)
              </EtsBootstrap.MenuItem>
            </EtsBootstrap.DropdownMenu>
          </EtsBootstrap.Dropdown>
          <EtsBootstrap.Dropdown id="waybill-print-dropdown_save" className="pdf" dropup disabled={!props.canGiveOutRead}
            overlayTrigger={savePrintOverlayTriggerConfig} toggleElement={waybillSaveDropdownPrintToggleElement}>
            <EtsBootstrap.DropdownMenu dropup pullRight>
              <EtsBootstrap.MenuItem id="save-print-plate_special"
                onSelect={props.handlePrint.bind(
                  null,
                  props.state.status !== 'draft' && !props.isCreating
                )}
                eventKey={'plate_bus'}
              >
                Форма №1 (автобус)
              </EtsBootstrap.MenuItem>
              <EtsBootstrap.MenuItem id="save_print-plate_truck"
                onSelect={props.handlePrint.bind(
                  null,
                  props.state.status !== 'draft' && !props.isCreating
                )}
                eventKey={'plate_truck'}
              >
                Форма №2 (грузовое ТС)
              </EtsBootstrap.MenuItem>
              <EtsBootstrap.MenuItem id="save-print-plate_car"
                onSelect={props.handlePrint.bind(
                  null,
                  props.state.status !== 'draft' && !props.isCreating
                )}
                eventKey={'plate_car'}
              >
                Форма №3 (легковое ТС)
              </EtsBootstrap.MenuItem>
              <EtsBootstrap.MenuItem id="save-print-plate_special"
                onSelect={props.handlePrint.bind(
                  null,
                  props.state.status !== 'draft' && !props.isCreating
                )}
                eventKey={'plate_special'}
              >
                Форма №4 (самоходная машина)
              </EtsBootstrap.MenuItem>
            </EtsBootstrap.DropdownMenu>
          </EtsBootstrap.Dropdown>
        </EtsButtonsContainer>
      </Div>
      <EtsButtonsContainer marginContainerY={4.5} marginContainerX={0}>
        <Div permissions={savePermissions} className={'inline-block'} hidden={isHiddenWaybillSubmitButton}>
          <EtsBootstrap.Button id="waybill-submit"
            onClick={props.handleSubmit}
            disabled={isDisabledWaybillSubmitButton}
          >
            Сохранить
          </EtsBootstrap.Button>
        </Div>
        <Div permissions={waybillPermissions.update} className={'inline-block'} style={{ marginLeft: 4 }}
          hidden={
            props.state.status === 'closed'
            || props.state.status === 'deleted'
            || !(props.formState.status && props.formState.status === 'active')
          }
        >
          <EtsBootstrap.Button id="close-waybill"
            onClick={() => props.handleClose(props.taxesControl)}
            disabled={!props.canClose}
          >
            Закрыть ПЛ
          </EtsBootstrap.Button>
        </Div>
      </EtsButtonsContainer>
    </EtsButtonsContainer>
  );
};

export default WaybillFooter;
