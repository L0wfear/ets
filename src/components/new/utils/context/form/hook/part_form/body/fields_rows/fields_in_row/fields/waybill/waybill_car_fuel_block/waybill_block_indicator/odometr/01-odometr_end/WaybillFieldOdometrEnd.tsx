import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

type StateProps = {
  permissionsSet: InitialStateSession['userData']['permissionsSet'];
};
type DispatchProps = DispatchProp;
type OwnProps = {
  formDataKey: string;
  md?: number;
};

type WaybillFieldOdometrEndProps = (
  StateProps
  & DispatchProps
  & OwnProps
);

const WaybillFieldOdometrEnd: React.FC<WaybillFieldOdometrEndProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const {
      odometr_end,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);
    const canEditIfClose = useWaybillFormData.useFormDataCanEditIfClose(props.formDataKey, props.permissionsSet);
    const isPermittedForDepartureAndArrivalValues = useWaybillFormData.useFormDataIsPermittedForDepartureAndArrivalValues(props.formDataKey, props.permissionsSet);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (keyName, valueNew) => {
        if (IS_CLOSE_OR_IS_ACTIVE) {
          const valueData = get(valueNew, 'target.value', null);

          handleChange({
            [keyName]: valueData ? Number(valueData) : null,
          });
        }
      },
      [handleChange, IS_CLOSE_OR_IS_ACTIVE],
    );

    React.useEffect(
      () => {
        return () => handleChangeWrap('odometr_end', null);
      },
      [handleChangeWrap],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.md || 12}>
          {
            IS_CLOSE_OR_IS_ACTIVE && (
              <ExtField
                id={`${path}_odometr_end`}
                type="number"
                label="Возвращение в гараж, км"
                value={odometr_end}
                onChange={handleChangeWrap}
                disabled={IS_CLOSED && !canEditIfClose || (!isPermitted && !isPermittedForDepartureAndArrivalValues)}

                boundKeys="odometr_end"
              />
            )
          }
        </EtsBootstrap.Col>
      ),
      [
        props,
        path,
        odometr_end,
        handleChangeWrap,
        IS_CLOSED,
        IS_CLOSE_OR_IS_ACTIVE,
        canEditIfClose,
        isPermitted,
      ],
    );
  },
);

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    permissionsSet: getSessionState(state).userData.permissionsSet,
  }),
)(WaybillFieldOdometrEnd);
