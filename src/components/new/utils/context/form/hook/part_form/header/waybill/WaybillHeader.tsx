import * as React from 'react';
import useWaybillFormData from '../../../../hook_selectors/waybill/useWaybillForm';
import { getTitleByStatus } from './utils';
import useForm from '../../../../hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type WaybillHeaderProps = {
  formDataKey: string;
};

const WaybillHeader: React.FC<WaybillHeaderProps> = React.memo(
  (props) => {
    const IS_CREATING = useForm.useFormDataSchemaIsCreating<Waybill>(props.formDataKey);
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);
    const IS_ACTIVE = useWaybillFormData.useFormDataIsActive(props.formDataKey);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);
    const number = useForm.useFormDataFormStatePickValue<Waybill>(props.formDataKey, 'number');

    const titleText = React.useMemo(
      () => {
        const title = getTitleByStatus(IS_CREATING, IS_DRAFT, IS_ACTIVE, IS_CLOSED, number);
        return title;
      },
      [IS_CREATING, IS_DRAFT, IS_ACTIVE, IS_CLOSED, number],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ titleText }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
      ),
      [props, titleText],
    );
  },
);

export default WaybillHeader;
