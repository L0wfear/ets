import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import { IReactSelectOption } from 'components/ui/@types/EtsSelect.h';
import { IBaseForm } from 'components/ui/@types/Form.h';
import { IVehicle, IVehicleRegister } from 'api/@types/services/index.h';

import { onChangeWithKeys } from 'components/compositions/hoc';
import Div from 'components/ui/Div.jsx';
import BaseField from 'components/ui/Field.jsx';
import config from 'config';
const styles = require('components/directories/cars/cars.module.scss');

const Field = onChangeWithKeys(BaseField);

export type TFormState = IVehicle & IVehicleRegister;

export interface IPropsRegisterInfoTab extends IBaseForm<IVehicle> {
  state: TFormState;
  errors?: TFormState;
  companyElements: IReactSelectOption;
}

const RegisterInfoTab: React.SFC<IPropsRegisterInfoTab> = props =>
  <div className={styles.carTab}>
    <Row>
      <Col md={6}>
        <Field
          type="string"
          label="Номер свидетельства о регистрации"
          value={props.state.register_certificate_number}
          onChange={props.onChange}
          boundKeys={['register_certificate_number']}
          disabled={!props.isPermitted}
        />
        <Field
          type="string"
          label="Кем выдано свидетельство о регистрации"
          value={props.state.register_given_by}
          onChange={props.onChange}
          boundKeys={['register_given_by']}
          disabled={!props.isPermitted}
          error={props.errors.register_given_by}
        />
        <Field
          type="date"
          time={false}
          label="Дата регистрации"
          date={props.state.register_given_at}
          onChange={props.onChange}
          boundKeys={['register_given_at']}
          disabled={!props.isPermitted}
        />
        <Field
          type="text"
          label="Особые отметки"
          value={props.state.register_note}
          onChange={props.onChange}
          boundKeys={['register_note']}
          textAreaStyle={{ resize: 'none' }}
          rows={7}
          disabled={!props.isPermitted}
          error={props.errors.register_note}
        />
      </Col>
      <Col md={6}>
        <Div className={styles.carImageWrapper} hidden={!props.state.type_image_name}>
          <img role="presentation" src={config.images + props.state.type_image_name} className="car-form-image" />
        </Div>
      </Col>
    </Row>
  </div>;

export default RegisterInfoTab;
