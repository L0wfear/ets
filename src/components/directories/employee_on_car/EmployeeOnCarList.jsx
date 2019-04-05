import * as React from 'react';
import { Route } from 'react-router-dom';

import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import EmployeeOnCarTable from 'components/directories/employee_on_car/table/EmployeeOnCarTable';
import { customOptionsTableFromMainResult } from 'components/directories/employee_on_car/table/helpData';
import { makeOptions } from 'components/ui/input/makeOptions';
import { compose } from 'recompose';
import { getSessionState } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';
import employeePermissions from 'components/new/pages/nsi/employee/_config-data/permissions';
import CarForm from 'components/new/pages/nsi/autobase/pages/car_actual/form/CarForm';
import { DivNone } from 'global-styled/global-styled';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import carActualPermissions from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/permissions';

const loadingPage = 'employee_on_car';

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
    if (this.props.userData.permissionsSet.has(carActualPermissions.read)) {
      this.setState({
        selectedElement: data,
      });
    }
  };

  onRowDoubleClick = ({ props: { data } }) => {
    if (this.props.userData.permissionsSet.has(carActualPermissions.read)) {
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

  onCarFormHide = (isSubmitted) => {
    this.setState({ carElement: null, showCarForm: false });
    if (isSubmitted) {
      this.init();
    }
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
    return (
      <React.Fragment>
        {this.state.showCarForm ? (
          // eslint-disable-next-line react/jsx-no-bind
          <Route
            path={`${this.props.match.url}/:tabKey?`}
            render={(...routeProps) => (
              <CarForm
                handleHide={this.onCarFormHide}
                element={this.state.showCarForm ? this.state.carElement : null}
                page={loadingPage}
                path="сarFormWrap"
                {...routeProps}
              />
            )}
          />
        ) : (
          <DivNone />
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  withSearch,
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(EmployeeOnCarList);
