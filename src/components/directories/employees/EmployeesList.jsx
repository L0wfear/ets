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
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('employees').getEmployees();
    flux.getActions('objects').getCars();
    flux.getActions('objects').getPositions();
    flux.getActions('companyStructure').getLinearCompanyStructureForUser();
  }
}
