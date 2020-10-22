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
import FilterButton from 'components/old/ui/table/filter/FilterButton';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

class DataTableInput extends React.Component<IPropsDataTableInput, IStateDataTableInput> {
  state = {
    selected: null,
    filterModalIsOpen: false,
    isFilterActive: false,
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

  handleRemoveItemWithConfirm = async () => {
    try {
      await global.confirmDialog({
        title: 'Внимание!',
        body: 'Вы уверены, что хотите удалить запись',
        okName: 'Удалить',
      });
      this.props.onItemRemove(this.state.selected.rowNumber - 1);
      this.setState({
        selected: null,
      });
    } catch (error) {
      //
    }
  };

  toggleFilter = () => {
    this.setState({ filterModalIsOpen: !this.state.filterModalIsOpen });
  };

  setisFilterActive = (isFilterActive: boolean) => {
    this.setState({ isFilterActive });
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
                    <FilterButton
                      active={this.state.isFilterActive}
                      onClick={this.toggleFilter}
                    />
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
                      onClick={this.props.removeItemWithConfirm ? this.handleRemoveItemWithConfirm : this.handleRemoveVehicle}
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
          noFilter={!this.props.useFilter}
          useFilter={!!this.props.useFilter}
          usePagination={!!this.props.usePagination}
          withPerPageSelector={!!this.props.withPerPageSelector}
          enumerated={false}
          enableSort={false}
          filterModalIsOpen={this.state.filterModalIsOpen}
          isFilterActive={this.state.isFilterActive}
          toggleFilter={this.toggleFilter}
          setisFilterActive={this.setisFilterActive}
        />
      </div>
    );
  }
}

export default DataTableInputWrapper(DataTableInput);
