import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import { IReactSelectOption } from 'components/ui/@types/EtsSelect.h';
import { IBaseForm } from 'components/ui/@types/Form.h';
import { IVehicle, IVehiclePassport } from 'api/@types/services/index.h';

import { onChangeWithKeys } from 'components/compositions/hoc';
import BaseField from 'components/ui/Field.jsx';
import GntTab from './pasportTabs/GtnTab';
import GibddTab from './pasportTabs/GibddTab';
const styles = require('components/directories/cars/cars.module.scss');

const Field = onChangeWithKeys(BaseField);

export type TFormState = IVehicle & IVehiclePassport;

export interface IPropsPassportInfoTab extends IBaseForm<IVehicle> {
  state: TFormState;
  errors?: TFormState;
  countryOptions: IReactSelectOption;
  engineTypeOptions: IReactSelectOption;
  propulsionTypeOptions: IReactSelectOption;
  carCategoryOptions: IReactSelectOption;
  companyElements: IReactSelectOption;
  typesOptions: IReactSelectOption;
  onOverlayLoading(): void;
}

const RegisterPassportInfoTab: React.SFC<IPropsPassportInfoTab> = props => {
  return  <div className={styles.carTab}>
    <Row>
      <Col md={6}>
        <Col md={6}>
          <Field
            type="boolean"
            label="ГИБДД"
            value={props.state.passport_type === 'GIBDD'}
            emptyValue={null}
            onChange={props.onChange}
            boundKeys={['passport_type', 'GIBDD']}
            disabled={!props.isPermitted}
          />
        </Col>
        <Col md={6}>
          <Field
            type="boolean"
            label="ГТН (Гостехнадзор)"
            value={props.state.passport_type === 'GTN'}
            emptyValue={null}
            onChange={props.onChange}
            boundKeys={['passport_type', 'GTN']}
            disabled={!props.isPermitted}
        />
        </Col>
      </Col>
    </Row>
    {
      props.state.passport_type === 'GTN' &&
      <GntTab
        {...props}
      />
    }
    {
      props.state.passport_type === 'GIBDD' &&
      <GibddTab
        {...props}
      />
    }
  </div>;
};

export default RegisterPassportInfoTab;
