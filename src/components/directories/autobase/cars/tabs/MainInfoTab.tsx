import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import { IReactSelectOption } from 'components/ui/@types/EtsSelect.h';
import { IBaseForm } from 'components/ui/@types/Form.h';
import { IVehicle } from 'api/@types/services/index.h';

import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import config from 'config';
const styles = require('components/directories/autobase/cars/cars.module.scss');

export interface IPropsMainInfoTab extends IBaseForm<IVehicle> {
  state: IVehicle;
  errors?: IVehicle;
  companyElements: IReactSelectOption;
  DRIVERS: IReactSelectOption;
}

const MainInfoTab: React.SFC<IPropsMainInfoTab> = props =>
  <div className={styles.carTab}>
    <Row>
      <Col md={6}>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <ExtField inline type="string" label="Рег. номер ТС" readOnly value={props.state.gov_number || 'Не указано'} />
          <ExtField inline type="string" label="Модель ТС" readOnly value={props.state.special_model_name || 'Не указано'} />
          <ExtField inline type="string" label="Марка шасси" readOnly value={props.state.model_name || 'Не указано'} />
          <ExtField inline type="string" label="Тип техники" readOnly value={props.state.type_name || 'Не указано'} />
          <ExtField inline type="string" label="Группа техники" readOnly value={props.state.car_group_name || 'Не указано'} />
        </div>
      </Col>
      <Col md={6}>
        <Div className={styles.carImageWrapper} hidden={!props.state.type_image_name}>
          <img role="presentation" src={config.images + props.state.type_image_name} className="car-form-image" />
        </Div>
      </Col>
    </Row>
    <Row>
      <Col md={6}>
        <ExtField
          type="date"
          time={false}
          label="Дата ввода ТС в эксплуатацию"
          date={props.state.exploitation_date_start}
          onChange={props.onChange}
          boundKeys={['exploitation_date_start']}
          disabled={!props.isPermitted}
        />
        <ExtField
          type="string"
          label="Гаражный номер"
          value={props.state.garage_number}
          onChange={props.onChange}
          boundKeys={['garage_number']}
          disabled={!props.isPermitted}
        />
        <ExtField
          type="select"
          label="Подразделение"
          options={props.companyElements}
          value={props.state.company_structure_id}
          onChange={props.onChange}
          boundKeys={['company_structure_id']}
          disabled={!props.isPermitted}
        />
        <ExtField
          type="string"
          label="Адрес стоянки"
          value={props.state.parking_address}
          onChange={props.onChange}
          boundKeys={['parking_address']}
          disabled={!props.isPermitted}
          error={props.errors.parking_address}
        />
      </Col>
      <Col md={6}>
        <ExtField
          type="number"
          label="Поправочный коэффициент"
          value={props.state.fuel_correction_rate}
          onChange={props.onChange}
          boundKeys={['fuel_correction_rate']}
          disabled={!props.isPermitted}
        />
        <ExtField
          type="text"
          label="Примечание"
          value={props.state.note}
          onChange={props.onChange}
          boundKeys={['note']}
          textAreaStyle={{ resize: 'none' }}
          rows={7}
          disabled={!props.isPermitted}
          error={props.errors.note}
        />
        <ExtField
          type="boolean"
          label="Общее"
          value={props.state.is_common}
          onChange={props.onChange}
          boundKeys={['is_common', !props.state.is_common]}
          disabled={!props.isPermitted}
        />
      </Col>
    </Row>
    <Row>
      <Col md={6}>
        <ExtField
          type="select"
          multi
          label="Основной водитель/машинист"
          options={props.DRIVERS}
          value={props.state.register_primary_drivers}
          onChange={props.onChange}
          boundKeys={['register_primary_drivers']}
          disabled={!props.isPermitted}
        />
      </Col>
      <Col md={6}>
        <ExtField
          type="select"
          multi
          label="Вторичный водитель/машинист"
          options={props.DRIVERS}
          value={props.state.register_secondary_drivers}
          onChange={props.onChange}
          boundKeys={['register_secondary_drivers']}
          disabled={!props.isPermitted}
        />
      </Col>
    </Row>
  </div>;

export default MainInfoTab;

// <ExtField type="string" label="Владелец" readOnly value={props.state.owner_name || 'Не указано'} />
