import * as React from 'react';
import { FieldDataWaybillDriverId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillDriverIdString from './string/FieldWaybillDriverIdString';
import FieldWaybillDriverIdArray from './array/FieldWaybillDriverIdArray';

type FieldWaybillDriverIdProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillDriverId;
};

const FieldWaybillDriverId: React.FC<FieldWaybillDriverIdProps> = React.memo(
  (props) => {
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);

    return React.useMemo(
      () => (
        <React.Fragment>
          {
            IS_DRAFT
              ? (
                <FieldWaybillDriverIdArray {...props} />
              )
              : (
                <FieldWaybillDriverIdString {...props} />
              )
          }
        </React.Fragment>
      ),
      [props, IS_DRAFT],
    );
  },
);

export default FieldWaybillDriverId;
