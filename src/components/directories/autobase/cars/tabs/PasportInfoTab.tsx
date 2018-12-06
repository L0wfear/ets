import * as React from 'react';

import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import { IReactSelectOption } from 'components/ui/@types/ReactSelect.h';
import { IBaseForm } from 'components/ui/@types/Form.h';
import { IVehicle, IVehiclePassport } from 'api/@types/services/index.h';

import { ExtField } from 'components/ui/new/field/ExtField';
import GntTab from './passportTabs/GtnTab';
import GibddTab from './passportTabs/GibddTab';
import { CarTab } from '../styled/styled';

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

const RegisterPassportInfoTab: React.FunctionComponent<IPropsPassportInfoTab> = (props) => {
  return (
    <CarTab>
      <Row>
        <Col md={6}>
          <Col md={6}>
            <ExtField
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
            <ExtField
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
    </CarTab>
  );
};

export default RegisterPassportInfoTab;
