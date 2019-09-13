import * as React from 'react';
import fuelCardsPermissions from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/permissions';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';
import { FuelCardsFormLazy } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { ButtonTableInput } from 'components/new/ui/table_input/styled';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';

type ButtonCreateFuelCardOwnProps = {
  id: string;
  handleUpdateFuelCard: () => any;
  structure_id: Waybill['structure_id'];
  fuel_type: Waybill['fuel_type'];
  buttonWidth: number;

  disabled: boolean;
  page: string;
};

type ButtonCreateFuelCardProps = (
  WithSearchProps
  & ButtonCreateFuelCardOwnProps
);

const ButtonCreateFuelCard: React.FC<ButtonCreateFuelCardProps> = React.memo(
  (props) => {
    const [showStatus, setShowStatus] = React.useState(false);

    const isPermitted = etsUseIsPermitted(fuelCardsPermissions.create);

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

    const onFormHide = React.useCallback(
      (isSubmitted?: boolean | any) => {
        if (isSubmitted) {
          props.handleUpdateFuelCard();
        }
        setShowStatus(false);
      },
      [],
    );
    const element = React.useMemo(
      () => {
        const partialFuelCard: Partial<FuelCard> = {};
        if (showStatus) {
          partialFuelCard.structure_id = props.structure_id;
          partialFuelCard.fuel_type = props.fuel_type;
        }

        return partialFuelCard;
      },
      [props.structure_id, props.fuel_type, showStatus],
    );

    return (
      <React.Fragment>
        <ButtonTableInput id={`${props.page}_${props.id}_add_fuel_card`} block width={props.buttonWidth} disabled={props.disabled} onClick={handleCreateFuelCard}>Создать топл. карту</ButtonTableInput>
        {
          showStatus && (
            <ErrorBoundaryForm>
              <React.Suspense fallback={<LoadingComponent />}>
                <FuelCardsFormLazy
                  element={element}
                  handleHide={onFormHide}

                  page={props.page}
                  fromWaybill
                />
              </React.Suspense>
            </ErrorBoundaryForm>
          )
        }
      </React.Fragment>
    );
  },
);

export default withSearch<ButtonCreateFuelCardOwnProps>(ButtonCreateFuelCard);
