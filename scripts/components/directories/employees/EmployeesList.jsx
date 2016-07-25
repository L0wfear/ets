import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import EmployeeFormWrap from './EmployeeFormWrap.jsx';
import EmployeesTable from './EmployeesTable.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

@connectToStores(['employees', 'objects'])
@staticProps({
  entity: 'employee',
  listName: 'employeesList',
  tableComponent: EmployeesTable,
  formComponent: EmployeeFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE']
})
export default class EmployeesList extends ElementsList {

	constructor(props, context) {
		super(props);
    // DELETE пока не используется
    // this.removeElementAction = context.flux.getActions('employees').deleteEmployee;
	}

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('employees').getEmployees();
    flux.getActions('objects').getPositions();
  }

}
