import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { IPropsDataTable } from 'components/old/ui/table/@types/DataTable.h';
import { IDataTableSelectedRow, ISchemaRenderer } from 'components/old/ui/table/@types/schema.h';
import { IPropsDataTableInput, IStateDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';

import DataTableComponent from 'components/old/ui/table/DataTable';
import DataTableInputWrapper from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { EtsHeaderContainer, EtsHeaderContainerWrap } from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

class DataTableInput extends React.Component<IPropsDataTableInput, IStateDataTableInput> {
  state = {
    selected: null,
  };

  handleRowSelected = (selected: IDataTableSelectedRow, rowNumber) => {
    if (this.state.selected !== null && selected.props.data.rowNumber === this.state.selected.rowNumber) {
      return;
    }
    this.setState({
      selected: {...selected.props.data, rowNumber },
    });
    this.props.onRowSelected(selected); // DataTableInputWrapper.tsx handleRowSelected()
  };
  handleAddVehicle = () => {
    this.props.onItemAdd();
    this.setState({
      selected: null,
    });
  };
  handleRemoveVehicle = () => {
    this.props.onItemRemove(this.state.selected.rowNumber - 1);
    this.setState({
      selected: null,
    });
  };

  buttonsDisable = () => this.props.buttonsDisable
    ? this.props.buttonsDisable(this.state.selected)
    : {
      addButtonDisable: false,
      removeButtonDisable: false,
    };

  render() {
    const {
      addButtonLabel = 'Добавить',
      removeButtonLable = 'Удалить',
    } = this.props;
    const extendedRenderers: ISchemaRenderer = this.props.renderers(this.props, this.props.onItemChange);

    const buttonsDisable = this.buttonsDisable();

    return (
      <div className="date-table-input">
        <EtsHeaderContainerWrap padding={'0px'}>
          <EtsHeaderContainer alignItems={'center'}>
            <EtsHeaderTitle>{this.props.tableTitle ? this.props.tableTitle : ''}</EtsHeaderTitle>
            <EtsButtonsContainer marginContainerY={5}>
              {
                !this.props.hideButtons
                  && <React.Fragment>
                    <EtsBootstrap.Button 
                      disabled={
                        buttonsDisable.addButtonDisable
                        || this.props.disabled
                        || !this.props.isPermitted
                      }
                      onClick={this.handleAddVehicle}
                    >
                      {addButtonLabel}
                    </EtsBootstrap.Button>
                    <EtsBootstrap.Button
                      disabled={
                        buttonsDisable.removeButtonDisable
                        || this.state.selected === null
                        || this.props.disabled
                        || !this.props.isPermitted
                      }
                      onClick={this.handleRemoveVehicle}
                    >
                      {removeButtonLable}
                    </EtsBootstrap.Button>
                  </React.Fragment>
              }
            </EtsButtonsContainer>
          </EtsHeaderContainer>
        </EtsHeaderContainerWrap>
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
        />
      </div>
    );
  }
}

export default DataTableInputWrapper(DataTableInput);
