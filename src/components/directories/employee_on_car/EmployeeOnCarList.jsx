import * as React from 'react';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import EmployeeOnCarTable from 'components/directories/employee_on_car/table/EmployeeOnCarTable';
import { customOptionsTableFromMainResult } from 'components/directories/employee_on_car/table/helpData';
import { makeOptions } from 'components/ui/input/makeOptions';
import CarFormWrap from 'components/directories/autobase/cars/CarFormWrap';
import permissionsCar from 'components/directories/autobase/cars/config-data/permissions';
import { compose } from 'recompose';
import { getSessionState } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';
import employeePermissions from 'components/new/pages/nsi/employee/_config-data/permissions';

@connectToStores(['employees', 'objects'])
@exportable({ entity: 'employee_on_car' })
@staticProps({
  entity: 'employee_on_car',
  permissions: employeePermissions,
  listName: 'employeeOnCarList',
  tableComponent: EmployeeOnCarTable,
  selectField: '_uniq_field',
  operations: ['LIST'],
})
class EmployeeOnCarList extends ElementsList {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      showCarForm: false,
      carElement: null,
    };
  }

  init() {
    this.context.flux.getActions('objects').getCars();
    this.context.flux
      .getActions('employees')
      .getEmployeeOnCarList()
      .then(({ result }) => {
        const options = makeOptions({
          data: result,
          options: customOptionsTableFromMainResult,
        });

        this.setState({ ...options });
        return { result };
      });
  }

  onRowClick = ({ props: { data } }) => {
    if (this.props.userPermissions.includes(permissionsCar.read)) {
      this.setState({
        selectedElement: data,
      });
    }
  };

  onRowDoubleClick = ({ props: { data } }) => {
    if (this.props.userPermissions.includes(permissionsCar.read)) {
      const carElement = this.props.carsList.find(
        ({ asuods_id }) => asuods_id === data.asuods_id,
      );

      if (!carElement) {
        console.error(
          `Нет ТС с asuods_id = ${this.state.selectedElement.car_id}`,
        );
      } else {
        this.setState({
          showCarForm: true,
          carElement,
        });
      }
    }
  };

  onCarFormHide = () => {
    this.setState({ carElement: null, showCarForm: false });
    this.init();
  };

  getAdditionalProps = () => {
    const {
      GOV_NUMBERS = [],
      GARAGE_NUMBERS = [],
      DRIVER_FIOS = [],
    } = this.state;
    return {
      GOV_NUMBERS,
      GARAGE_NUMBERS,
      DRIVER_FIOS,
    };
  };

  additionalRender() {
    return [
      <CarFormWrap
        key="carFormWrap"
        showForm={this.state.showCarForm}
        onFormHide={this.onCarFormHide}
        element={this.state.carElement}
        entity="car"
        permissions={[permissionsCar.read]}
        flux={this.context.flux}
        {...this.props}
      />,
    ];
  }
}

export default compose(
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(EmployeeOnCarList);
