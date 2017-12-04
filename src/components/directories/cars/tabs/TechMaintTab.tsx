import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { get } from lodash;

import { IBaseForm } from 'components/ui/@types/Form.h';
import { IVehicle } from 'api/@types/services/index.h';
import BaseField from 'components/ui/Field.jsx';
import { onChangeWithKeys } from 'components/compositions/hoc';

const Field = onChangeWithKeys(BaseField);

interface ITechMaintListExtra {
  car_interval_probeg: string;
  car_interval_time: string;
}

interface IPropsInfoTab extends IBaseForm<IVehicle> {
  techMaintListExtra: ITechMaintListExtra;
  type: boolean;
  children: any;
}

const InfoTab: React.SFC<IPropsInfoTab> = props => {
  const { type = false, techMaintListExtra } = props;
  return   <div style={{ marginTop: 10 }}>
    <Row>
      <Col md={6}>
        <Field type="string" label={type && 'Срок по пробегу, м/ч:' || 'Срок до ТО по пробегу, км:'} readOnly value={techMaintListExtra.car_interval_probeg || 'Не указано'} />
      </Col>
      <Col md={6}>
        <Field type="string" label="Срок по времени, дней:" readOnly value={get(techMaintListExtra, 'car_interval_time', '-')} />
      </Col>
    </Row>
    <Row>
      <Col>
        {props.children}
      </Col>
    </Row>
</div>;
};

export default InfoTab;
