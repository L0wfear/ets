import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillCarActualOptions from './useWaybillCarActualOptions';
import usePrevious from 'components/new/utils/hooks/usePrevious';

type FieldWaybillTrailerIdArrayProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillTrailerIdArray: React.FC<FieldWaybillTrailerIdArrayProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);

    const structure_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['structure_id']>(props.formDataKey, 'structure_id');
    const trailer_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['trailer_id']>(props.formDataKey, 'trailer_id');

    const formErrors = useForm.useFormDataFormErrors<any>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);

    const carActualOptionData = useWaybillCarActualOptions(props.formDataKey, trailer_id, structure_id);

    const handleChangeWrap = React.useCallback(
      (_, value) => {
        handleChange({
          trailer_id: value,
        });
      },
      [handleChange],
    );

    const previosStructure = usePrevious(structure_id);

    React.useEffect(
      () => {
        if (previosStructure !== structure_id) {
          if (structure_id) {
            handleChangeWrap('trailer_id', null);
          }
        }
      },
      [previosStructure, structure_id, handleChangeWrap],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <ExtField
          id={`${path}_trailer_id`}
          type="select"
          label="Прицеп"
          value={trailer_id}
          error={formErrors.trailer_id}
          options={carActualOptionData.options}
          onChange={handleChangeWrap}
          disabled={!isPermitted}

          etsIsLoading={carActualOptionData.isLoading}
          boundKeys="trailer_id"
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillTrailerIdArray;
