import * as React from 'react';

import TableInput, { TableMeta } from 'components/new/ui/table_input/TableInput';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import FielNormsHeader from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/FielNormsHeader';
import { actionGetAndSetInStoreNormsByParams } from 'redux-main/reducers/modules/some_uniq/norm_registry/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { metaTechnicalOperationId } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/technical_operation_id/TdTechnicalOperationId';
import { metaMunicipalFacilityId } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/municipal_facility_id/TdMunicipalFacilityId';
import { metaSeasonId } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/season_id/TdSeasonId';
import { metaIsWithoutNorm } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/is_without_norm/TdIsWithoutNorm';
import { metaValue } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/value/TdValue';
import { metaDateStart } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/date_start/TdDateStart';
import { metaDateEnd } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/date_end/TdDateEnd';
import { actionGetAndSetInStoreMunicipalFacilityMeasureUnit } from 'redux-main/reducers/modules/some_uniq/municipal_facility/actions';

type Props = {
  formDataKey: 'consumable_material';
};

const metaCarRefillRaw: TableMeta<ValuesOf<ConsumableMaterial['norms']>>[] = [
  metaTechnicalOperationId,
  metaMunicipalFacilityId,
  metaSeasonId,
  metaIsWithoutNorm,
  metaValue,
  metaDateStart,
  metaDateEnd,
];

const FieldNorms: React.FC<Props> = React.memo(
  (props) => {
    const [selectedRowIndex, setSelectedRowIndex] = React.useState(null);

    const meta = useForm.useFormDataMeta(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<ConsumableMaterial>(props.formDataKey);
    const norms = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['norms']>(props.formDataKey, 'norms');
    const errors = useForm.useFormDataFormErrorsPickValue<ConsumableMaterial, Array<any>>(props.formDataKey, 'norms');
    const isPermitted = useForm.useFormDataIsPermitted<ConsumableMaterial>(props.formDataKey);

    const dispatch = etsUseDispatch();

    const disabled = !isPermitted;

    const handleChangeWrap = React.useCallback(
      (value) => {
        handleChange({ norms: value });
      },
      [handleChange],
    );

    React.useEffect(() => {
        dispatch(actionGetAndSetInStoreNormsByParams(null, meta));
        dispatch(actionGetAndSetInStoreMunicipalFacilityMeasureUnit(null, meta));
      }, [],
    );

    return (
      <TableInput
        array={norms}
        errors={errors}
        meta={metaCarRefillRaw}
        onChange={handleChangeWrap}

        header={
          <FielNormsHeader
            selectedRowIndex={selectedRowIndex}
            meta={metaCarRefillRaw}

            buttonWidth={160}
            formDataKey={props.formDataKey}
          />
        }
        selectedRowIndex={selectedRowIndex}
        setSelectedRowIndex={setSelectedRowIndex}

        disabled={disabled}

        formDataKey={props.formDataKey}
      />
    );
  },
);

export default FieldNorms;
