import * as React from 'react';
import { each, toArray } from 'lodash';

import {
  TPropsDataTableInputWrapper,
  TInjectedPropsDataTableInputWrapper,
  IStateDataTableInputWrapper,
} from './DataTableInputWrapper.h';

import { validateField } from 'utils/validate/validateField';

const DataTableInputWrapper: ETSCore.Types.THOCFunction<TInjectedPropsDataTableInputWrapper, TPropsDataTableInputWrapper> = SourceComponent =>
  class DataTableInputWrapperHOC extends React.Component<TPropsDataTableInputWrapper, IStateDataTableInputWrapper> {
    state = {
      outputListErrors: [],
      isValidInput: true,
    };
    componentDidMount() {
      this.validate(this.props.inputList);
    }
    validate(inputList) {
      const outputListErrors = inputList.map((rowData, i) => {
        const errors = this.state.outputListErrors[i] ? { ...this.state.outputListErrors[i] } : {};

        each(this.props.validationSchema.properties, prop => {
          errors[prop.key] = validateField(prop, rowData[prop.key], rowData, this.props.validationSchema);
        });

        return errors;
      });

      const isValidInput = !outputListErrors.map(errorItem => {
        return toArray(errorItem)
          .map(v => !!v)
          .filter(ev => ev === true)
          .length;
      }).some(value => value > 0);

      const validityOptions = {
        outputListErrors,
        isValidInput,
      };

      this.setState(validityOptions);

      this.props.onValidation(validityOptions);
    }
    handleItemChange = (index, key, value) => {
      const newItems = this.props.inputList.map(
        (item: any, i) => i === index
          ? ({
            ...item,
            [key]: value,
          })
          : item,
      );
      this.props.onChange(newItems);
      this.validate(newItems);
    }
    handleItemAdd = () => {
      const newItems = this.props.tableSchema.cols
        .map(columnMeta => ({ [columnMeta.name]: undefined }))
        .reduce((acc, curr) => ({ ...acc, ...curr }));

      const finalValue = this.props.stackOrder
        ? [newItems, ...this.props.inputList]
        : [...this.props.inputList, newItems];
      this.props.onChange(finalValue);
      this.validate(finalValue);
    }
    handleItemRemove = (index: number = this.props.inputList.length - 1) => {
      if (this.props.inputList.length === 0) {
        return;
      }

      const newItems = this.props.inputList.filter((item, i: number) => i !== index);

      this.props.onChange(newItems);
      this.validate(newItems);
    }
    handleRowSelected = selectedRow => {
      // noDefine
    }
    render() {

      return (
        <SourceComponent
          {...this.props}
          {...this.state}
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
