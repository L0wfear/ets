import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import EmployeeFormWrap from './EmployeeFormWrap.jsx';
import EmployeesTable from './EmployeesTable.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['employees', 'objects', 'session'])
@exportable({ entity: 'employee' })
@staticProps({
  entity: 'employee',
  listName: 'employeesList',
  tableComponent: EmployeesTable,
  formComponent: EmployeeFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE'],
})
export default class EmployeesList extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('employees').getEmployees();
  }

}
