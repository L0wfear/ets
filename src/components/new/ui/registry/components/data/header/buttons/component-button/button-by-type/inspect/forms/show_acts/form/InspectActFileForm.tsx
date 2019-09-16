import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataMetaByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { mapFormMeta } from 'redux-main/reducers/modules/form_data_record/actions';
import ModalHeaderDefault from 'components/@next/@form/hook/part_form/ModalHeaderDefault';
import ModalFooterDefault from 'components/@next/@form/hook/part_form/ModalFooterDefault';
import FieldNotes from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/form/notes/FieldNotes';
import FieldFiles from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/form/files/FieldFiles';

type Props = {
  formDataKey: FormKeys;
  handleHide: any;
};

const InspectActFileForm: React.FC<Props> = React.memo(
  (props) => {
    const { formDataKey } = props;

    const bsSizeForm = mapFormMeta[formDataKey].bsSizeForm;
    const meta = etsUseSelector((state) => getFormDataMetaByKey(state, formDataKey));

    return (
      <EtsBootstrap.ModalContainer id={`modal-${formDataKey}}`} show onHide={props.handleHide} bsSize={bsSizeForm}>
        <ModalHeaderDefault formDataKey={formDataKey} handleHide={props.handleHide} />
        <ModalBodyPreloader meta={meta} typePreloader="mainpage">
          <FieldFiles formDataKey={formDataKey}/>
          <FieldNotes formDataKey={formDataKey}/>
        </ModalBodyPreloader>
        <ModalFooterDefault formDataKey={formDataKey} handleHide={props.handleHide} />
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default InspectActFileForm;
