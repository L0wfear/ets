
import * as React from 'react';
import { connect } from 'react-redux';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { ReduxState } from 'redux-main/@types/state';
import {
  StatePropsFieldEdcRequestData,
  DispatchPropsFieldEdcRequestData,
  OwnPropsFieldEdcRequestData,
  PropsFieldEdcRequestData,
} from 'components/new/pages/missions/mission/form/main/inside_fields/edc_request/FieldEdcRequestData.h';
import { DivNone } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const FieldEdcRequestData: React.FC<PropsFieldEdcRequestData> = (props) => {
  const {
    request_id,
    edcRequest,
  } = props;

  return request_id && edcRequest
    ? (
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Категория дефекта"
              value={edcRequest.deffect_category_name}
              disabled
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Наименование дефекта"
              value={edcRequest.defect_name}
              disabled
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
    )
    : (
      <DivNone />
    );
};

export default connect<StatePropsFieldEdcRequestData, DispatchPropsFieldEdcRequestData, OwnPropsFieldEdcRequestData, ReduxState>(
  null,
)(FieldEdcRequestData);
