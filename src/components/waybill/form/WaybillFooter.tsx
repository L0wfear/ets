import * as React from 'react';
import { Button, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';

import { isEmpty } from 'utils/functions';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import DivForEnhance from 'components/ui/Div.jsx';

const Div = enhanceWithPermissions(DivForEnhance);

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
}

const WaybillFooter: React.SFC<IPropsWaybillFooter> = props =>
  <Div>
    <Div className={'inline-block'} style={{ marginRight: 5 }} hidden={!(props.isCreating || props.isDraft)}>
      <Button id="waybill-refresh" title="Обновить" onClick={props.refresh} disabled={isEmpty(props.state.car_id)}><Glyphicon glyph="refresh" /></Button>
    </Div>
    <Div className="inline-block" permissions={(props.state.status !== 'closed' && props.state.status !== 'active') ? [`${props.entity}.plate`] : undefined}>
      <Dropdown id="waybill-print-dropdown_ptint" dropup disabled={!props.canSave} onSelect={props.handlePrintFromMiniButton}>
        <Dropdown.Toggle disabled={!props.canSave}>
          <Glyphicon glyph="print" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem id="print-3C" eventKey={'plate_special'}>Форма 3-С</MenuItem>
          <MenuItem id="print-4P" eventKey={'plate_truck'}>Форма 4-П</MenuItem>
          <MenuItem id="print-6" eventKey={'plate_bus'}>Форма №6 (спец)</MenuItem>
          <MenuItem id="print-3" eventKey={'plate_car'}>Форма №3</MenuItem>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown id="waybill-print-dropdown_save" dropup disabled={!props.canSave} onSelect={props.handlePrint.bind(null, props.state.status !== 'draft' && !props.isCreating)}>
        <Dropdown.Toggle disabled={!props.canSave}>
          <Glyphicon id="waybill-download-pdf" glyph="download-alt" /> {props.state.status === 'closed' || props.state.status === 'active' ? 'Просмотр' : 'Выдать'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem id="save-3C" eventKey={'plate_special'}>Форма 3-С</MenuItem>
          <MenuItem id="save-4P" eventKey={'plate_truck'}>Форма 4-П</MenuItem>
          <MenuItem id="save-6" eventKey={'plate_bus'}>Форма №6 (спец)</MenuItem>
          <MenuItem id="save-3" eventKey={'plate_car'}>Форма №3</MenuItem>
        </Dropdown.Menu>
      </Dropdown>&nbsp;
    </Div>
    <Div oneOfPermissions={['waybill.update_closed', 'waybill.update']} className={'inline-block'} hidden={props.state.status === 'closed' && !props.canEditIfClose}>
      <Button id="waybill-submit" onClick={props.handleSubmit} disabled={!props.canSave && !props.state.canEditIfClose}>Сохранить</Button>
    </Div>
    <Div className={'inline-block'} style={{ marginLeft: 4 }} hidden={props.state.status === 'closed' || !(props.formState.status && props.formState.status === 'active')}>
      <Button id="close-waybill" onClick={() => props.handleClose(props.taxesControl)} disabled={!props.canClose}>Закрыть ПЛ</Button>
    </Div>
  </Div>;

export default WaybillFooter;
