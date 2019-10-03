import * as React from 'react';
import * as PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import * as cx from 'classnames';
import { get } from 'lodash';
import { isArray, isNullOrUndefined, isString, isObject } from 'util';

import { EtsPreloaderFieldContainer } from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';

import {
  onChangeSelectLegacy,
  defaultSortingFunction,
} from 'components/old/ui/input/ReactSelect/utils';
import { SingleValueProps } from 'react-select/src/components/SingleValue';
import { MultiValueProps } from 'react-select/src/components/MultiValue';
import { SingleValue, MultiValue, MenuList } from 'components/old/ui/input/ReactSelect/styled/styled';
import { DivRelative } from 'global-styled/global-styled';
import VirtualizedSelectList from '../VirtualizedSelectList/VirtualizedSelectList';
import { detectIE } from 'utils/functions';

require('components/old/ui/input/ReactSelect/ReactSelect.scss');

const openMenuIds = {};

/**
 * @todo уйти от легаси
 */
export default class ReactSelect extends React.Component<any, any> {
  static defaultProps = {
    legacy: true,
    clearable: true,
    etsIsLoading: false,
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
      etsIsLoading: PropTypes.bool,
    };
  }
  constructor(props) {
    super(props);

    if (process.env.STAND !== 'prod') {
      global.test = {
        ...get(global, 'test', {}),
        makeSelectIsOpenById: this.makeSelectIsOpenById,
      };
    }

    this.state = {
      components: {
        Option: this.optionRenderer,
        SingleValue: this.singleValueRender,
        MultiValue: this.multiValueRender,
        MultiValueContainer: this.multiValueContainerReander,
        MenuList: this.menuListRender,
      },
    };
  }

  makeSelectIsOpenById = (key) => {
    if (process.env.STAND !== 'prod') {
      if (openMenuIds[key]) {
        delete openMenuIds[key];
      } else {
        openMenuIds[key] = true;
      }
      console.log('%cСлушаюсь', 'font-size: 18px; background: #222; color: #bada55'); // tslint:disable-line:no-console
      this.forceUpdate();
    }
  }

  handleChange = (objectValue) => {
    const {
      emptyValue = '',
      multi,
      legacy,
    } = this.props;

    if (!legacy) {
      return this.props.onChange(objectValue);
    }

    this.props.onChange(
      onChangeSelectLegacy(
        objectValue === null ? emptyValue : objectValue,
        multi,
      ),
      !multi
        ? objectValue
        : objectValue ?
          objectValue
          : [],
    );
  }

  menuListRender = (props: any) => {
    if (props.children.length > 500 && !detectIE()) {
      return <VirtualizedSelectList {...props} />;
    }
    return <MenuList {...props} />;
  }

  multiValueContainerReander = (props: any) => {
    if (this.props.multiValueContainerReander) {
      return this.props.multiValueContainerReander(props);
    }

    return <components.MultiValueContainer {...props} />;
  }

  optionRenderer = ({ innerProps, ...props }: any) => {
    const { components: propsComponents } = this.props;

    const newInnerProps = {
      ...innerProps,
      id: innerProps.id.replace(/option-\d+$/, `value-${props.value}`),
    };

    if (isObject(propsComponents) && propsComponents.Option) {
      return <propsComponents.Option innerProps={newInnerProps} {...props} />;
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
    const isNotVisible = get(option, 'data.isNotVisible', false) || false;
    const { value } = this.props;

    return !isNotVisible && (
      label.trim().toLocaleLowerCase().includes(
        filterValue.trim().toLocaleLowerCase(),
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

    return <MultiValue innerProps={newInnerProps} {...props} />;
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
      etsIsLoading,
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
      <DivRelative>
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
          placeholder={etsIsLoading ? 'Загрузка...' : placeholder}
          noOptionsMessage={this.noOptionsMessage}
          components={this.state.components}
          isDisabled={disabled}
          menuIsOpen={get(openMenuIds, id, undefined)}
        />
        {
          etsIsLoading
            && (
              <EtsPreloaderFieldContainer>
                <PreloadNew typePreloader="field" />
              </EtsPreloaderFieldContainer>
            )
        }
      </DivRelative>
    );
  }
}
