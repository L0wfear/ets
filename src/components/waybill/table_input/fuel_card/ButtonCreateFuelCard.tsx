import * as React from 'react';
import { compose } from 'recompose';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import fuelCardsPermissions from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/permissions';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';
import { FuelCardsFormLazy } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { FuelCards } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { ButtonTableInput } from 'components/new/ui/table_input/styled';

type ButtonCreateFuelCardOwnProps = {
  handleUpdateFuelCards: () => any;
  page: string;
  structure_id: Waybill['structure_id'];
  fuel_type: Waybill['fuel_type'];
  buttonWidth: number;

  disabled: boolean;
};

type ButtonCreateFuelCardProps = (
  WithSearchProps
  & { isPermitted: boolean }
  & ButtonCreateFuelCardOwnProps
);

const ButtonCreateFuelCard: React.FC<ButtonCreateFuelCardProps> = React.memo(
  (props) => {
    const [showStatus, setShowStatus] = React.useState(false);

    const handleCreateFuelCard = React.useCallback(
      () => {
        if (props.isPermitted) {
          setShowStatus(true);
        } else {
          global.NOTIFICATION_SYSTEM.notify('Недостаточно прав', 'warning', 'tr');
        }
      },
      [],
    );

    const onFormHide = React.useCallback(
      (isSubmitted?: boolean | any) => {
        if (isSubmitted) {
          props.handleUpdateFuelCards();
        }
        setShowStatus(false);
      },
      [],
    );
    const element = React.useMemo(
      () => {
        const partialFuelCard: Partial<FuelCards> = {};
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
        <ButtonTableInput block width={props.buttonWidth} disabled={props.disabled} onClick={handleCreateFuelCard}>Создать топл. карту</ButtonTableInput>
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

export default compose<ButtonCreateFuelCardProps, ButtonCreateFuelCardOwnProps>(
  withRequirePermissionsNew({
    permissions: fuelCardsPermissions.create,
    withIsPermittedProps: true,
  }),
  withSearch,
)(ButtonCreateFuelCard);
