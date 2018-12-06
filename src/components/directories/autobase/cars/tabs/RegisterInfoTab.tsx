import * as React from 'react';

import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import { IReactSelectOption } from 'components/ui/@types/ReactSelect.h';
import { IBaseForm } from 'components/ui/@types/Form.h';
import { IVehicle, IVehicleRegister } from 'api/@types/services/index.h';

import { ExtField } from 'components/ui/new/field/ExtField';
import config from 'config';
import { CarTab, CarImageWrapper } from 'components/directories/autobase/cars/styled/styled';
import { DivNone } from 'global-styled/global-styled';

export type TFormState = IVehicle & IVehicleRegister;

export interface IPropsRegisterInfoTab extends IBaseForm<IVehicle> {
  state: TFormState;
  errors?: TFormState;
  companyElements: IReactSelectOption;
}

const RegisterInfoTab: React.FunctionComponent<IPropsRegisterInfoTab> = (props) =>
  <CarTab>
    <Row>
      <Col md={6}>
        <ExtField
          type="string"
          label="Номер свидетельства о регистрации"
          value={props.state.register_certificate_number}
          onChange={props.onChange}
          boundKeys={['register_certificate_number']}
          disabled={!props.isPermitted}
        />
        <ExtField
          type="string"
          label="Кем выдано свидетельство о регистрации"
          value={props.state.register_given_by}
          onChange={props.onChange}
          boundKeys={['register_given_by']}
          disabled={!props.isPermitted}
          error={props.errors.register_given_by}
        />
        <ExtField
          type="date"
          time={false}
          label="Дата регистрации"
          date={props.state.register_given_at}
          onChange={props.onChange}
          boundKeys={['register_given_at']}
          disabled={!props.isPermitted}
        />
        <ExtField
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
      {
        props.state.type_image_name
        ? (
          <CarImageWrapper>
            <img role="presentation" src={config.images + props.state.type_image_name} className="car-form-image" />
          </CarImageWrapper>
        )
        : (
          <DivNone />
        )
      }
      </Col>
    </Row>
  </CarTab>;

export default RegisterInfoTab;
