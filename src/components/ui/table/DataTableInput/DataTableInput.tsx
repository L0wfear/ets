import * as React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';
import { IDataTableSelectedRow, ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTableInput, IStateDataTableInput } from 'components/ui/table/DataTableInput/DataTableInput.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DataTableInputWrapper from 'components/ui/table/DataTableInputWrapper/DataTableInputWrapper';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

class DataTableInput extends React.Component<IPropsDataTableInput, IStateDataTableInput> {
  state = {
    selected: null,
  }
  handleRowSelected = (selected: IDataTableSelectedRow) => {
    if (this.state.selected !== null && selected.props.data.rowNumber === this.state.selected.rowNumber) {
      return;
    }

    this.setState({
      selected: selected.props.data,
    });

    this.props.onRowSelected(selected);
  }
  handleAddVehicle = () => {
    this.props.onItemAdd();
    this.setState({
      selected: null,
    });
  }
  handleRemoveVehicle = () => {
    this.props.onItemRemove(this.state.selected.rowNumber - 1);
    this.setState({
      selected: null,
    });
  }
  render() {
    const {
      addButtonLabel = 'Добавить',
      removeButtonLable = 'Удалить',
    } = this.props;
    const extendedRenderers: ISchemaRenderer = this.props.renderers(this.props, this.props.onItemChange);

    return (
      <div className="date-table-input">
         <div className="pull-right">
          <ButtonToolbar>
            <Button disabled={this.props.disabled} onClick={this.handleAddVehicle}>{addButtonLabel}</Button>
            <Button disabled={this.state.selected === null || this.props.disabled} onClick={this.handleRemoveVehicle}>{removeButtonLable}</Button>
          </ButtonToolbar>
        </div>
        <DataTable
          title=""
          results={this.props.inputList}
          tableMeta={this.props.tableSchema}
          onRowSelected={this.handleRowSelected}
          renderers={extendedRenderers}
          selectField={this.props.selectField || 'rowNumber'}
          selected={this.state.selected}
          noFilter
          usePagination={false}
          enumerated={false}
          enableSort={false}
          initialSort={false}
        />
      </div>
    );
  }
}

export default DataTableInputWrapper(DataTableInput);
