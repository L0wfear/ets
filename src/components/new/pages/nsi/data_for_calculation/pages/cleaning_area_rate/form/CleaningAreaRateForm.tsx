import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataMetaByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

import { mapFormMeta } from 'redux-main/reducers/modules/form_data_record/actions';
import ModalHeaderDefault from 'components/@next/@form/hook/part_form/ModalHeaderDefault';
import ModalFooterDefault from 'components/@next/@form/hook/part_form/ModalFooterDefault';
import FieldTechnicalOperationId from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/form/technical_operation_id/FieldTechnicalOperationId';
import FieldMunicipalFacilityId from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/form/municipal_facility_id/FieldMunicipalFacilityId';
import FieldLoad from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/form/load/FieldLoad';
import FieldCleanCategoryId from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/form/clean_category_id/FieldCleanCategoryId';
import FieldCleanSubcategoryId from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/form/clean_subcategory_id/FieldCleanSubcategoryId';
import FieldValue from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/form/value/FieldValue';

type Props = {
  formDataKey: 'cleaning_area_rate';
  handleHide: any;
};

const CleaningAreaRateForm: React.FC<Props> = React.memo(
  (props) => {
    const { formDataKey } = props;

    const bsSizeForm = mapFormMeta[formDataKey].bsSizeForm;
    const meta = etsUseSelector((state) => getFormDataMetaByKey(state, formDataKey));

    return (
      <EtsBootstrap.ModalContainer id={`modal-${formDataKey}}`} show onHide={props.handleHide} bsSize={bsSizeForm}>
        <ModalHeaderDefault formDataKey={formDataKey} handleHide={props.handleHide} />
        <ModalBodyPreloader meta={meta} typePreloader="mainpage">

          <FieldLoad formDataKey={formDataKey} />

          <FieldTechnicalOperationId formDataKey={formDataKey} />
          <FieldMunicipalFacilityId formDataKey={formDataKey} />

          <FieldCleanCategoryId formDataKey={formDataKey} />
          <FieldCleanSubcategoryId formDataKey={formDataKey} />

          <FieldValue formDataKey={formDataKey} />

        </ModalBodyPreloader>
        <ModalFooterDefault formDataKey={formDataKey} handleHide={props.handleHide} />
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default CleaningAreaRateForm;
