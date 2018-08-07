import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import EmployeeFormWrap from './EmployeeFormWrap.jsx';
import EmployeesTable from './EmployeesTable.tsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['employees', 'objects', 'session', 'companyStructure'])
@exportable({ entity: 'employee' })
@staticProps({
  entity: 'employee',
  listName: 'employeesList',
  tableComponent: EmployeesTable,
  formComponent: EmployeeFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE'],
})
export default class EmployeesList extends ElementsList {
  constructor() {
    super();
    this.preventUrlFilters = true;
  }
  async componentDidMount() {
    super.componentDidMount();

    const { flux } = this.context;
    const [employees] = await Promise.all([
      flux.getActions('employees').getEmployees(),
      flux.getActions('objects').getCars(),
      flux.getActions('objects').getPositions(),
      flux.getActions('companyStructure').getLinearCompanyStructureForUser(),
    ]);

    if (this.props.location.query.employee_id) {
      const employee_id = parseInt(this.props.location.query.employee_id, 10);
      const selectedElement = employees.result.find(employee => employee.id === employee_id);
      if (selectedElement) {
        // NOTE Так надо, потому что открыть форму можно только через стейт родительского класса
        this.setState({
          ...this.state,
          selectedElement,
          showForm: true,
        });
      } else {
        this.props.history.replaceState(null, this.props.location.pathname, {});
      }
    }
  }
}
