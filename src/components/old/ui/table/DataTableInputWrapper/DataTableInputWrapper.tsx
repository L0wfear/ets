import * as React from 'react';

import {
  TPropsDataTableInputWrapper,
  TInjectedPropsDataTableInputWrapper,
  IStateDataTableInputWrapper,
} from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';
import { get } from 'lodash';

import { isString } from 'util';
import { DataTableInputOutputListErrors, isValidDataTableInput } from 'components/old/ui/table/utils';

const DataTableInputWrapper: ETSCore.Types.THOCFunction<TInjectedPropsDataTableInputWrapper, TPropsDataTableInputWrapper> = (SourceComponent) =>
  class DataTableInputWrapperHOC extends React.Component<TPropsDataTableInputWrapper, IStateDataTableInputWrapper> {
    state = {
      outputListErrors: [],
      isValidInput: true,
      selectedIndex: null,
    };
    componentDidMount() {
      this.validate(this.props.inputList);
    }
    validate(inputList) {
      if (this.props.onValidation) {

        const outputListErrors = DataTableInputOutputListErrors(inputList, this.state.outputListErrors, this.props.validationSchema);
        const isValidInput = isValidDataTableInput(outputListErrors);

        const validityOptions = {
          outputListErrors,
          isValidInput,
          selectedIndex: this.state.selectedIndex,
        };

        this.setState(validityOptions);

        this.props.onValidation(validityOptions);
      }
    }
    handleItemChange = (indexOwn: number, keyOrObj: string | object, value: any) => {
      const index = indexOwn || this.state.selectedIndex || 0;
      const newItems = this.props.inputList.map(
        (item: any, i) => {
          if (i === index) {
            if (isString(keyOrObj)) {
              return ({
                ...item,
                [keyOrObj]: get(value, 'target.value', value),
              });
            }

            return ({
              ...item,
              ...keyOrObj,
            });
          }
          return item;
        },
      );
      this.props.onChange(newItems);
      this.validate(newItems);
    };
    handleItemAdd = () => {
      const { inputList } = this.props;
      let maxCustomId = 0;
      inputList.map((item) => {
        maxCustomId = item.customId > maxCustomId ? item.customId : maxCustomId;
        return item;
      });
      const newItems = this.props.tableSchema.cols
        .map((columnMeta) => ({ [columnMeta.name]: undefined }))
        .reduce((acc, curr) => ({ ...acc, ...curr, customId: maxCustomId + 1}));
      const finalValue = this.props.stackOrder
        ? [newItems, ...this.props.inputList]
        : [...this.props.inputList, newItems];
      this.props.onChange(finalValue);
      this.validate(finalValue);
    };
    handleItemRemove = (indexOwn: number = this.props.inputList.length - 1) => {
      const index = indexOwn || this.state.selectedIndex || 0;
      if (this.props.inputList.length === 0) {
        return;
      }
      const newItems = this.props.inputList.filter((item, i: number) => i !== index);
      this.props.onChange(newItems);
      this.validate(newItems);
    };
    handleRowSelected = (selectedRow) => {
      let selectedIndex = 0;
      this.props.inputList.forEach((item, index) => {
        selectedIndex = item.customId === selectedRow.props.data.customId ? index : selectedIndex;
      });
      this.setState({ selectedIndex });
    };
    render() {

      return (
        <SourceComponent
          {...this.props}
          {...this.state}
          outputListErrors={this.props.outerValidate ? this.props.errors : this.state.outputListErrors}
          onItemChange={this.handleItemChange}
          onItemAdd={this.handleItemAdd}
          onItemRemove={this.handleItemRemove}
          onRowSelected={this.handleRowSelected}
        >
          {this.props.children}
        </SourceComponent>
      );
    }
  };

export default DataTableInputWrapper;
