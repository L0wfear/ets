import * as queryString from 'query-string';

import { staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import EmployeeFormWrap from 'components/directories/employees/EmployeeForm/EmployeeFormWrap';
import EmployeesTable from 'components/directories/employees/EmployeesTable';

import permissions from 'components/directories/employees/config-data/permissions';
import { connect } from 'react-redux';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { getEmployeeState, getSessionState } from 'redux-main/reducers/selectors';

const loadingPageName = 'employees';


@exportable({ entity: 'employee' })
@staticProps({
  entity: 'employee',
  permissions,
  listName: 'employeeList',
  tableComponent: EmployeesTable,
  formComponent: EmployeeFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE'],
})
class EmployeesList extends ElementsList {
  preventUrlFilters = true;

  removeElementAction = async (id) => {
    try {
      await this.props.autobaseRemoveBatteryBrand(id);
      this.init();
    } catch (e) {
      //
    }
  }

  async init() {
    const { employeeIndex } = await this.props.employeeGetAndSetInStore();

    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    if (searchObject.employee_id) {
      const employee_id = parseInt(searchObject.employee_id, 10);
      const selectedElement = employeeIndex[employee_id];

      if (selectedElement) {
        this.setState({
          selectedElement,
          showForm: true,
        });
      }
      this.props.history.replace(this.props.match.url);
    }
  }

  componentWillUnmount() {
    this.props.employeeEmployeeResetSetEmployee();
  }

  onFormHide = (isSubmitted) => {
    const changeState = {
      showForm: false,
    };

    if (isSubmitted) {
      this.init();
      changeState.selectedElement = null;
    }

    this.setState(changeState);
  }

  getAdditionalFormProps() {
    return {
      loadingPageName,
    };
  }

  getBasicProps() {
    const { listName } = this.constructor;

    return {
      data: this.props[listName],
      entity: this.entity,
      filterValues: {
        active: {
          type: 'multiselect',
          value: [1],
        },
      },
    };
  }
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    state => ({
      employeeList: getEmployeeState(state).employeeList,
      userData: getSessionState(state).userData,
    }),
    dispatch => ({
      employeeGetAndSetInStore: () => (
        dispatch(
          employeeActions.employeeGetAndSetInStore(
            {},
            {
              page: loadingPageName,
            },
          ),
        )
      ),
      employeeEmployeeResetSetEmployee: () => (
        dispatch(
          employeeActions.employeeEmployeeResetSetEmployee(),
        )
      ),
      employeeRemoveEmployee: id => (
        dispatch(
          employeeActions.employeeRemoveEmployee(
            id,
            {
              page: loadingPageName,
            },
          ),
        )
      ),
    }),
  ),
)(EmployeesList);
