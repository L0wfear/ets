import * as React from 'react';
import { get } from 'lodash';
import { connect, DispatchProp } from 'react-redux';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import useStructureOptions from 'components/new/utils/hooks/services/useOptions/useStructureOptions';
import { FieldDataWaybillStuctureId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillStructureIdStateProps = {
  userStructureId: InitialStateSession['userData']['structure_id'];
};
type FieldWaybillStructureIdDispatchProps = DispatchProp;
type FieldWaybillStructureIdOwnProps = {
  fieldData: FieldDataWaybillStuctureId;
  formDataKey: string;
};
type FieldWaybillStructureIdProps = (
  FieldWaybillStructureIdStateProps
  & FieldWaybillStructureIdDispatchProps
  & FieldWaybillStructureIdOwnProps
);

const FieldWaybillStructureId: React.FC<FieldWaybillStructureIdProps> = React.memo(
  (props) => {
    const {
      fieldData: { title, clearable, key },
    } = props;

    const path = useForm.useFormDataSchemaPath<Waybill>(props.formDataKey);
    const formState = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);
    const {
      isLoading,
      options,
    } = useForm.useFormDataLoadOptions<WaybillFormStoreType, 'structure_id'>(
      props.formDataKey,
      'structure_id',
      useStructureOptions(),
    );

    const structurePickData = useWaybillFormData.useWaybillPickStructureData(
      options,
      props.userStructureId,
    );

    const handleChangeWrap = React.useCallback(
      (value, option) => {
        handleChange({
          structure_id: value,
          structure_name: get(option, 'rowData.name', null),
        });
      },
      [key, handleChange],
    );

    return React.useMemo(
      () => {
        const isDisabled = (
          !isPermitted
          || IS_CLOSE_OR_IS_ACTIVE
          || structurePickData.STRUCTURE_FIELD_READONLY
        );

        return (
          structurePickData.STRUCTURE_FIELD_VIEW
            && (
              <EtsBootstrap.Col md={props.fieldData.md || 12}>
                {
                  !isDisabled
                    ? (
                      <ExtField
                        id={`${path}_${key}`}
                        type="select"
                        label={title}
                        value={formState[key]}
                        error={formErrors[key]}
                        options={options}
                        onChange={handleChangeWrap}
                        clearable={clearable || structurePickData.STRUCTURE_FIELD_DELETABLE}

                        etsIsLoading={isLoading}
                      />
                    )
                    : (
                      <ExtField
                        id={`${path}_${key}`}
                        type="string"
                        label={title}
                        value={formState.structure_name ? formState.structure_name : 'Не выбрано'}
                        disabled
                      />
                    )
                }
              </EtsBootstrap.Col>
            )
        );
      },
      [
        path,
        key,
        clearable,
        title,
        formState[key],
        IS_CLOSE_OR_IS_ACTIVE,
        formErrors[key],
        options,
        handleChangeWrap,
        isPermitted,
        structurePickData,
      ],
    );
  },
);

export default connect<FieldWaybillStructureIdStateProps, FieldWaybillStructureIdDispatchProps, FieldWaybillStructureIdOwnProps, ReduxState>(
  (state) => ({
    userStructureId: getSessionState(state).userData.structure_id,
  }),
)(FieldWaybillStructureId);
