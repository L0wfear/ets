import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import { useSelector } from 'react-redux';
import { compose } from 'recompose';
import CarActualAddBatteryRegistryForm from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/car_actual/car_actual_add_battery_registry_form/CarActualAddBatteryRegistryForm';
import batteryRegistryPermissions from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data/permissions';

type ButtonCarActualAddBatteryStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonCarActualAddBatteryDispatchProps = {
  // registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  // actionCarActualAddBatteryByPartialData: HandleThunkActionCreator<typeof actionCarActualAddBatteryByPartialData>;
  // actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type ButtonCarActualAddBatteryOwnProps = {
  registryKey: string;
};
type ButtonCarActualAddBatteryMergeProps = {};

type ButtonCarActualAddBatteryProps = (
  ButtonCarActualAddBatteryStateProps
  & ButtonCarActualAddBatteryDispatchProps
  & ButtonCarActualAddBatteryOwnProps
  & ButtonCarActualAddBatteryMergeProps
);

const ButtonCarActualAddBattery: React.FC<ButtonCarActualAddBatteryProps> = React.memo(
  (props) => {
    const [showCarActualAddBatteryRegistryForm, setShowCarActualAddBatteryRegistryForm] = React.useState(false);
    const handleClickAddBattery = React.useCallback(
      () => {
        setShowCarActualAddBatteryRegistryForm(true);
      },
      [props.selectedRow],
    );
    const handleHide = React.useCallback(
      () => {
        setShowCarActualAddBatteryRegistryForm(false);
      },
      [props.selectedRow],
    );

    const disabled = false;
    // const permissions = useSelector(
    //   (state: ReduxState) => getListData(state.registry, props.registryKey).permissions.update,
    // );
    // const uniqKey = useSelector(
    //   (state: ReduxState) => getListData(state.registry, props.registryKey).data.uniqKey,
    // );
    const selectedRow = useSelector(
      (state: ReduxState) => getListData(state.registry, props.registryKey).data.selectedRow,
    );
    // const checkedRows = useSelector(
    //   (state: ReduxState) => getListData(state.registry, props.registryKey).data.checkedRows,
    // );

    return (
      <React.Fragment>
        <EtsBootstrap.Button id="car_actual-add_battery" bsSize="small" onClick={handleClickAddBattery} disabled={disabled}>
          <EtsBootstrap.Glyphicon glyph="plus" /> Добавить
        </EtsBootstrap.Button>
        {
          showCarActualAddBatteryRegistryForm && (
            <CarActualAddBatteryRegistryForm
              element={selectedRow}
              handleHide={handleHide}

              page={props.registryKey}
            />
          )
        }
      </React.Fragment>
    );
  },
);

export default compose<ButtonCarActualAddBatteryProps, ButtonCarActualAddBatteryOwnProps>(
  withRequirePermissionsNew({
    permissions: batteryRegistryPermissions.update,
  }),
)(ButtonCarActualAddBattery);
