import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataMetaByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

import { mapFormMeta } from 'redux-main/reducers/modules/form_data_record/actions';
import ModalHeaderDefault from 'components/@next/@form/hook/part_form/ModalHeaderDefault';
import ModalFooterDefault from 'components/@next/@form/hook/part_form/ModalFooterDefault';

import FieldNormPeriod from 'components/new/pages/nsi/norm_registry/form/norm_period/FieldNormPeriod';
import FieldCheckTypes from 'components/new/pages/nsi/norm_registry/form/check_types/FieldCheckTypes';
import FieldObjectsIds from 'components/new/pages/nsi/norm_registry/form/objects_ids/FieldObjectsIds';
import FieldCarFuncTypesIds from 'components/new/pages/nsi/norm_registry/form/car_func_types_ids/FieldCarFuncTypesIds';
import FieldConsumableMaterialsNames from 'components/new/pages/nsi/norm_registry/form/consumable_materials_names/FieldConsumableMaterialsNames';
import FieldSensorTypeIds from 'components/new/pages/nsi/norm_registry/form/sensor_type_ids/FieldSensorTypeIds';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import DefaultFieldString from 'components/@next/@form/defult_fields/DefaultFieldString';

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
              <DefaultFieldString<Norm> formDataKey={formDataKey} name="Наименование" field_name="name" disabled />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <DefaultFieldString<Norm> formDataKey={formDataKey} name="Элемент" field_name="elements_text" disabled />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <DefaultFieldString<Norm> formDataKey={formDataKey} name="Сезон" field_name="season_name" disabled />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <DefaultFieldString<Norm> formDataKey={formDataKey} name="Способ выполнения" field_name="kind_task_names_text" disabled />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>

          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={3}>
              <DefaultFieldString<Norm> formDataKey={formDataKey} name="Способ уборки" field_name="work_type_name" disabled />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={3}>
              <DefaultFieldString<Norm> formDataKey={formDataKey} name="Условия" field_name="conditions" disabled />
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
