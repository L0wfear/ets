import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataMetaByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

import { mapFormMeta } from 'redux-main/reducers/modules/form_data_record/actions';
import ModalHeaderDefault from 'components/@next/@form/hook/part_form/ModalHeaderDefault';
import ModalFooterDefault from 'components/@next/@form/hook/part_form/ModalFooterDefault';
import FieldMeasureUnitId from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/measure_unit_id/FieldMeasureUnitId';
import FieldNorms from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/FieldNorms';
import DefaultFieldString from 'components/@next/@form/defult_fields/DefaultFieldString';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';

type Props = {
  formDataKey: 'consumable_material';
  handleHide: any;
};

const MaintenanceWorkForm: React.FC<Props> = React.memo(
  (props) => {
    const { formDataKey } = props;

    const bsSizeForm = mapFormMeta[formDataKey].bsSizeForm;
    const meta = etsUseSelector((state) => getFormDataMetaByKey(state, formDataKey));

    return (
      <EtsBootstrap.ModalContainer id={`modal-${formDataKey}}`} show onHide={props.handleHide} bsSize={bsSizeForm}>
        <ModalHeaderDefault formDataKey={formDataKey} handleHide={props.handleHide} />
        <ModalBodyPreloader meta={meta} typePreloader="mainpage">
          <DefaultFieldString<ConsumableMaterial> formDataKey={formDataKey} name="Наименование" field_name="name" />
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={8}>
              <DefaultFieldString<ConsumableMaterial> formDataKey={formDataKey} name="Сокращенное наименование" field_name="short_name" />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <FieldMeasureUnitId formDataKey={formDataKey} />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12} zIndex={0}>
              <FieldNorms formDataKey={formDataKey} />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <ModalFooterDefault formDataKey={formDataKey} handleHide={props.handleHide} />
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default MaintenanceWorkForm;
