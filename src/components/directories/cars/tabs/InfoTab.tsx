import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import { IReactSelectOption } from 'components/ui/@types/EtsSelect.h';
import { IBaseForm } from 'components/ui/@types/Form.h';
import { IVehicle } from 'api/@types/services/index.h';

import { onChangeWithKeys } from 'components/compositions/hoc';
import Div from 'components/ui/Div.jsx';
import BaseField from 'components/ui/Field.jsx';
import config from 'config';

const Field = onChangeWithKeys(BaseField);

interface IPropsInfoTab extends IBaseForm<IVehicle> {
  state: IVehicle;
  companyElements: IReactSelectOption;
}

const InfoTab: React.SFC<IPropsInfoTab> = props =>
  <div style={{ marginTop: 10 }}>
    <Row>
      <Col md={6}>
        <Div hidden={!props.state.type_image_name}>
          <img role="presentation" src={config.images + props.state.type_image_name} className="car-form-image" />
        </Div>
      </Col>

      <Col md={6}>
        <Field
          type="select"
          label="Подразделение"
          options={props.companyElements}
          value={props.state.company_structure_id}
          clearable={false}
          onChange={props.onChange}
          boundKeys={['company_structure_id']}
          disabled={!props.isPermitted}
        />

        <Field
          type="string"
          label="Гаражный номер"
          value={props.state.garage_number}
          onChange={props.onChange}
          boundKeys={['garage_number']}
          disabled={!props.isPermitted}
        />

        <Field
          type="number"
          label="Поправочный коэффициент"
          value={props.state.fuel_correction_rate}
          onChange={props.onChange}
          boundKeys={['fuel_correction_rate']}
          disabled={!props.isPermitted}
        />
        <Field
          type="boolean"
          label="Общее"
          value={props.state.is_common}
          onChange={props.onChange}
          boundKeys={['is_common', !props.state.is_common]}
        />
      </Col>
    </Row>

    <Row>
      <Col md={6}>
        <Field type="string" label="Владелец" readOnly value={props.state.owner_name || 'Не указано'} />
        <Field type="string" label="Рег. номер ТС" readOnly value={props.state.gov_number || 'Не указано'} />
        <Field type="string" label="Марка шасси" readOnly value={props.state.model_name || 'Не указано'} />
        <Field type="string" label="Тип" readOnly value={props.state.type_name || 'Не указано'} />
      </Col>
    </Row>
</div>;

export default InfoTab;
