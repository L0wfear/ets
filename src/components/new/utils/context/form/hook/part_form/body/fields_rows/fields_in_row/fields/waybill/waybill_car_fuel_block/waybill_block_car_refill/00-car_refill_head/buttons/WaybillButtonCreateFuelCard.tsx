import * as React from 'react';

import fuelCardsPermissions from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/permissions';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';
import { FuelCardsFormLazy } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { ButtonTableInput } from 'components/new/ui/table_input/styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type WaybillButtonCreateFuelCardProps = {
  formDataKey: string;
};

const WaybillButtonCreateFuelCard: React.FC<WaybillButtonCreateFuelCardProps> = React.memo(
  (props) => {
    const [showStatus, setShowStatus] = React.useState(false);
    const isPermitted = etsUseSelector(
      (state) => getSessionState(state).userData.permissionsSet.has(fuelCardsPermissions.create),
    );
    const page = useForm.useFormDataSchemaPage<Waybill>(props.formDataKey);
    const {
      structure_id,
      fuel_type,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);

    const handleCreateFuelCard = React.useCallback(
      () => {
        if (isPermitted) {
          setShowStatus(true);
        } else {
          global.NOTIFICATION_SYSTEM.notify('Недостаточно прав', 'warning', 'tr');
        }
      },
      [isPermitted],
    );

    const handleChangeStore = useForm.useFormDataHandleChangeStore<Waybill, WaybillFormStoreType>(props.formDataKey);
    const store = useForm.useFormDataStore<Waybill, WaybillFormStoreType>(props.formDataKey);
    const onFormHide = React.useCallback(
      (isSubmitted: boolean | any, result: FuelCard) => {
        if (isSubmitted) {
          handleChangeStore({
            fuelCardsList: {
              ...store.fuelCardsList,
              list: [...store.fuelCardsList.list, result],
            },
          });
        }
        setShowStatus(false);
      },
      [handleChangeStore, store.fuelCardsList],
    );

    const element = React.useMemo(
      () => {
        const partialFuelCard: Partial<FuelCard> = {};
        if (showStatus) {
          partialFuelCard.structure_id = structure_id;
          partialFuelCard.fuel_type = fuel_type;
        }

        return partialFuelCard;
      },
      [structure_id, fuel_type, showStatus],
    );

    return React.useMemo(
      () => (
        <React.Fragment>
          <ButtonTableInput block width={160} onClick={handleCreateFuelCard}>Создать топл. карту</ButtonTableInput>
          {
            showStatus && (
              <ErrorBoundaryForm>
                <React.Suspense fallback={<LoadingComponent />}>
                  <FuelCardsFormLazy
                    element={element}
                    handleHide={onFormHide}

                    page={page}
                    fromWaybill
                  />
                </React.Suspense>
              </ErrorBoundaryForm>
            )
          }
        </React.Fragment>
      ),
      [
        page,
        isPermitted,
        showStatus,
        element,
        onFormHide,
      ],
    );
  },
);

export default WaybillButtonCreateFuelCard;
