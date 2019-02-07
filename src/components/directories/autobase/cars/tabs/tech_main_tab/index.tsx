import * as React from 'react';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import { get } from 'lodash';
import TechMaintList from 'components/directories/autobase/tech_maintenance_registry/config-data/components';

import BaseField from 'components/ui/Field';
import { onChangeWithKeys } from 'components/compositions/hoc';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getAutobaseState } from 'redux-main/reducers/selectors';

import {
  StatePropsTechMaintTab,
  DispatchPropsTechMaintTab,
  PropsTechMaintTab,
  OwnPropsTechMaintTab,
} from 'components/directories/autobase/cars/tabs/tech_main_tab/index.h';
import { TechMaintTabWrap } from './styled';

const Field: any = onChangeWithKeys(BaseField);

const TechMaintTab: React.FunctionComponent<PropsTechMaintTab> = (props) => {
  const {
    type,
    techMaintExtra,
  } = props;

  return (
    <TechMaintTabWrap>
      <Row>
        <Col md={12}>
          <Col md={6}>
            <Field
              type="string"
              label={type ? 'Срок по пробегу, м/ч:' : 'Срок до ТО по пробегу, км:'}
              readOnly
              value={get(techMaintExtra, 'car_interval_probeg', '-') || 'Не указано'}
            />
          </Col>
          <Col md={6}>
            <Field
              type="string"
              label="Срок по времени, дней:"
              readOnly
              value={get(techMaintExtra, 'car_interval_time', '-')}
            />
          </Col>
        </Col>
      </Row>
      <TechMaintList
        car_id={props.car_id}
        car_model_id={props.car_model_id}
        gov_number={props.gov_number}
      />
    </TechMaintTabWrap>
  );
};

export default connect<StatePropsTechMaintTab, DispatchPropsTechMaintTab, OwnPropsTechMaintTab, ReduxState>(
  (state) => ({
    techMaintExtra: getAutobaseState(state).techMaintExtra, // запрос в TechMaintList
  }),
)(TechMaintTab);
