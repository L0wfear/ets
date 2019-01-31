import * as React from 'react';
import * as PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import * as cx from 'classnames';
import { get } from 'lodash';

import {
  onChangeSelectLegacy,
  defaultSortingFunction,
} from 'components/ui/input/ReactSelect/utils';
import { SingleValueProps } from 'react-select/lib/components/SingleValue';
import { MultiValueProps } from 'react-select/lib/components/MultiValue';
import { isArray, isNullOrUndefined, isString, isObject } from 'util';
import { SingleValue } from 'components/ui/input/ReactSelect/styled/styled';

require('components/ui/input/ReactSelect/ReactSelect.scss');

/**
 * @todo уйти от легаси
 */
export default class ReactSelect extends React.Component<any, any> {
  static defaultProps = {
    legacy: true,
    clearable: true,
  };

  static get propTypes() {
    return {
      placeholder: PropTypes.string,
      noResultsText: PropTypes.string,
      options: PropTypes.array,
      sortingFunction: PropTypes.func,
      emptyValue: PropTypes.string,
      onChange: PropTypes.func,
      fieldName: PropTypes.string,
      selectType: PropTypes.string,
    };
  }
  constructor(props) {
    super(props);

    this.state = {
      components: {
        Option: this.optionRenderer,
        SingleValue: this.singleValueRender,
        MultiValue: this.multiValueRender,
        MultiValueContainer: this.multiValueContainerReander,
      },
    };
  }

  handleChange = (objectValue) => {
    const {
      emptyValue = '',
      multi,
    } = this.props;

    this.props.onChange(
      onChangeSelectLegacy(
        objectValue === null ? emptyValue : objectValue,
        multi,
      ),
      objectValue,
    );
  }
  multiValueContainerReander = (props: any) => {
    if (this.props.multiValueContainerReander) {
      return this.props.multiValueContainerReander(props);
    }

    return <components.MultiValueContainer {...props} />;
  }

  optionRenderer = ({ innerProps, ...props }: any) => {
    const newInnerProps = {
      ...innerProps,
      id: innerProps.id.replace(/option-\d+$/, `value-${props.value}`),
    };

    if (this.props.optionRenderer && typeof this.props.optionRenderer === 'function') {
      return <components.Option innerProps={newInnerProps} {...props} >{this.props.optionRenderer(props)}</ components.Option>;
    }
    return <components.Option innerProps={newInnerProps} {...props} />;
  }

  noOptionsMessage = () => this.props.noResultsText || 'Нет данных';

  filterOption = (option, filterValue: string) => {
    if (this.props.filterOption) {
      return this.props.filterOption(option, filterValue, this.props);
    }
    const label = (get(option, 'label', '') || '').toString() || '';
    const valueOpt = get(option, 'value', null) || null;
    const { value } = this.props;

    return (
      label.toLocaleLowerCase().includes(
        filterValue.toLocaleLowerCase(),
      )
      && (
        isArray(value)
        ? (
          !value.includes(valueOpt)
        )
        : (
          !isNullOrUndefined(value)
            ? (
              value !== valueOpt
            )
            : (
              true
            )
        )
      )
    );
  }

  singleValueRender = ({ innerProps, ...props }: SingleValueProps<any>) => {
    const {
      modalKey,
      components: propsComponents ,
    } = this.props;

    const id = this.props.id ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-value` : undefined;

    const newInnerProps = {
      ...innerProps,
      id,
    };

    if (isString(props.data.label)) {
      newInnerProps.title = props.data.label;
    }

    if (isObject(propsComponents) && propsComponents.SingleValue) {
      return <propsComponents.SingleValue innerProps={newInnerProps} {...props} />;
    }

    return <SingleValue innerProps={newInnerProps} {...props}  />;
  }

  multiValueRender = ({ innerProps, ...props }: MultiValueProps<any>) => {
    const { components: propsComponents } = this.props;

    const {
      selectProps: { instanceId },
      data: { value },
    } = props;

    const id = instanceId ? `${instanceId}-value-${value}` : undefined;

    const newInnerProps = {
      ...innerProps,
      id,
    };

    if (isObject(propsComponents) && propsComponents.MultiValue) {
      return <propsComponents.MultiValue innerProps={newInnerProps} {...props} />;
    }

    return <components.MultiValue innerProps={newInnerProps} {...props} />;
  }
  render() {
    const {
      placeholder = 'Выберите...',
      options = [],
      sortingFunction = defaultSortingFunction,
      className,
      modalKey,
      disabled,
      clearable,
      legacy,
      multi,
      ...props
    } = this.props;

    const sortedOptions = options.sort(sortingFunction);
    const instanceId = modalKey ? `${modalKey}-${this.props.id}` : this.props.id;

    let value = props.value;

    if (legacy) {
      value = value !== null && value !== undefined ?
          multi ?
              sortedOptions.filter(({ value: op_value }) => value.includes(op_value))
            :
              sortedOptions.find(({ value: op_value }) => op_value === value)
        :
          null;
    }

    const id = this.props.id ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-container` : undefined;

    return (
      <Select
        {...props}
        id={id}
        filterOption={this.filterOption}
        instanceId={instanceId}
        isClearable={clearable}
        isMulti={multi}
        value={value}
        className={cx(
          'react-select',
          className,
        )}
        classNamePrefix="react-select"
        onChange={this.handleChange}
        options={sortedOptions}
        placeholder={placeholder}
        noOptionsMessage={this.noOptionsMessage}
        components={this.state.components}
        isDisabled={disabled}
      />
    );
  }
}
