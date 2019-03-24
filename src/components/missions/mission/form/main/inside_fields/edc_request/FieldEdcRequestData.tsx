
import * as React from 'react';
import { connect } from 'react-redux';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  StatePropsFieldEdcRequestData,
  DispatchPropsFieldEdcRequestData,
  OwnPropsFieldEdcRequestData,
  PropsFieldEdcRequestData,
} from 'components/missions/mission/form/main/inside_fields/edc_request/FieldEdcRequestData.h';
import { Row, Col } from 'react-bootstrap';
import { DivNone } from 'global-styled/global-styled';

const FieldEdcRequestData: React.FC<PropsFieldEdcRequestData> = (props) => {
  const {
    request_id,
    edcRequest,
  } = props;

  return request_id && edcRequest
    ? (
        <Row>
          <Col md={6}>
            <ExtField
              type="string"
              label="Категория дефекта"
              value={edcRequest.deffect_category_name}
              disabled
            />
          </Col>
          <Col md={6}>
            <ExtField
              type="string"
              label="Наименование дефекта"
              value={edcRequest.defect_name}
              disabled
            />
          </Col>
        </Row>
    )
    : (
      <DivNone />
    );
};

export default connect<StatePropsFieldEdcRequestData, DispatchPropsFieldEdcRequestData, OwnPropsFieldEdcRequestData, ReduxState>(
  null,
)(FieldEdcRequestData);
