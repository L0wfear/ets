import * as React from 'react';
import { EtsTable, EtsTableWrapNoScroll } from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import TableInputThead from './thead/TableInputThead';
import TableInputTbody from './tbody/TableInputTbody';
import EtsBootstrap from '../@bootstrap';
import { EtsTableDataContainer } from '../registry/components/data/table-data/styled/styled';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

export type PropsToTdReactComponent = {
  formDataKey: FormKeys;
  indexRow: number;
};

export type TableMeta<F> = {
  key: Extract<keyof F, string>;
  title: string;
  titlePopup?: string;
  width: number;
  ReactComponentType?: React.ComponentType<PropsToTdReactComponent>;
  disabled?: boolean;
  default_value?: any;
  onChange?: (onChange: (partilaF: Partial<F>) => any) => (value, option?: any) => any;
  disabledIf?: Array<{
    type: 'compare_with_value_in_option';
    path_to_option: string;
    compareItemPath: string;
    match: any;
  }>;
  resetIf?: Array<{
    type: 'compare_with_value_in_option';
    path_to_option: string;
    compareItemPath: string;
    match: any;
  }>;
} & (
  {
    format: 'select';
    options: Array<any>;
    placeholder?: string;
    uniqValueInCol?: boolean;
  } | {
    format: 'number';
  } | {
    format: 'boolean';
  } | {
    format: 'date';
    time?: boolean;
  } | {
    format: 'string';
  }
);

export type TableInputProps = {
  id: string;
  meta: Array<TableMeta<any>>;
  array: Array<any>;
  errors?: Array<any>;
  onChange: any;

  header: any;
  selectedRowIndex: number;
  setSelectedRowIndex: any;

  disabled: boolean;

  formDataKey?: FormKeys;
};

const TableInput: React.FC<TableInputProps> = React.memo(
  (props) => {
    const {
      disabled,
    } = props;

    React.useEffect(
      () => {
        if (props.selectedRowIndex >= props.array.length) {
          props.setSelectedRowIndex(null);
        }
      },
      [props.array.length, props.selectedRowIndex, props.setSelectedRowIndex],
    );

    const errors = React.useMemo(
      () => {
        return props.errors || [];
      },
      [props.errors],
    );

    return (
      <React.Fragment>
        {
          props.header
        }
        <EtsBootstrap.Row>
          {
            Boolean(props.array.length)
              && (
                <EtsTableDataContainer>
                  <EtsTableWrapNoScroll className="ets_table_wrap">
                    <EtsTable fixedWidth id={`${props.id || 'default'}_table`}>
                      <TableInputThead
                        meta={props.meta}
                      />
                      <TableInputTbody
                        meta={props.meta}
                        array={props.array}
                        errors={errors}
                        onChange={props.onChange}
                        selectedRowIndex={props.selectedRowIndex}
                        setSelectedRowIndex={props.setSelectedRowIndex}
                        disabled={disabled}

                        formDataKey={props.formDataKey}
                      />
                    </EtsTable>
                  </EtsTableWrapNoScroll>
                </EtsTableDataContainer>
              )
          }
        </EtsBootstrap.Row>
      </React.Fragment>
    );
  },
);

export default TableInput;
