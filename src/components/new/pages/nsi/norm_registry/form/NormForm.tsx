import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataMetaByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

import { mapFormMeta } from 'redux-main/reducers/modules/form_data_record/actions';
import ModalHeaderDefault from 'components/@next/@form/hook/part_form/ModalHeaderDefault';
import ModalFooterDefault from 'components/@next/@form/hook/part_form/ModalFooterDefault';
import FieldName from 'components/new/pages/nsi/norm_registry/form/name/FieldName';
import FieldElement from 'components/new/pages/nsi/norm_registry/form/element/FieldElement';
import FieldSeason from 'components/new/pages/nsi/norm_registry/form/season/FieldSeason';
import FieldKindTaskNames from 'components/new/pages/nsi/norm_registry/form/kind_task_names/FieldKindTaskNames';
import FieldWorkTypeName from 'components/new/pages/nsi/norm_registry/form/work_type_name/FieldWorkTypeName';
import FieldConditions from 'components/new/pages/nsi/norm_registry/form/conditions/FieldConditions';
import FieldNormPeriod from 'components/new/pages/nsi/norm_registry/form/norm_period/FieldNormPeriod';
import FieldCheckTypes from 'components/new/pages/nsi/norm_registry/form/check_types/FieldCheckTypes';
import FieldObjectsIds from 'components/new/pages/nsi/norm_registry/form/objects_ids/FieldObjectsIds';
import FieldCarFuncTypesIds from 'components/new/pages/nsi/norm_registry/form/car_func_types_ids/FieldCarFuncTypesIds';
import FieldConsumableMaterialsNames from 'components/new/pages/nsi/norm_registry/form/consumable_materials_names/FieldConsumableMaterialsNames';
import FieldSensorTypeIds from 'components/new/pages/nsi/norm_registry/form/sensor_type_ids/FieldSensorTypeIds';

type Props = {
  formDataKey: 'norm';
  handleHide: any;
};

const NormForm: React.FC<Props> = React.memo(
  (props) => {
    const { formDataKey } = props;

    const bsSizeForm = mapFormMeta[formDataKey].bsSizeForm;
    const meta = etsUseSelector((state) => getFormDataMetaByKey(state, formDataKey));

    return (
      <EtsBootstrap.ModalContainer id={`modal-${formDataKey}}`} show onHide={props.handleHide} bsSize={bsSizeForm}>
        <ModalHeaderDefault formDataKey={formDataKey} handleHide={props.handleHide} />
        <ModalBodyPreloader meta={meta} typePreloader="mainpage">

          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={3}>
              <FieldName formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <FieldElement formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <FieldSeason formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <FieldKindTaskNames formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>

          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={3}>
              <FieldWorkTypeName formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <FieldConditions formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <FieldNormPeriod formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <FieldCheckTypes formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>

          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={3}>
              <FieldObjectsIds formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>

          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={3}>
              <FieldCarFuncTypesIds formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <FieldSensorTypeIds formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <FieldConsumableMaterialsNames formDataKey={props.formDataKey} />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>

        </ModalBodyPreloader>
        <ModalFooterDefault formDataKey={formDataKey} handleHide={props.handleHide} />
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default NormForm;
