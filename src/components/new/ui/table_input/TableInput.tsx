import * as React from 'react';
import { EtsTable } from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import TableInputThead from './thead/TableInputThead';
import TableInputTbody from './tbody/TableInputTbody';
import { Button } from 'react-bootstrap';
import { DisplayFlexAlignCenterFooterForm } from 'global-styled/global-styled';

export type TableMeta<F> = {
  key: string;
  title: string;
  width: number;
  disabled?: boolean;
  disabledIf?: {
    type: 'compare_with_value_in_option',
    path_to_option: string,
    compareItemPath: string,
    match: any,
  }[];
} & (
  {
    format: 'select';
    options: any[];
    placeholder?: string;
    uniqValueInCol?: boolean;
  } | {
    format: 'number';
  }
);

export type TableInputProps = {
  meta: TableMeta<any>[];
  array: any[];
  errors: any[];
  onChange: any;
  addName?: string;
  visibleAdd: boolean;
  removeName?: string;
  visibleRemove: boolean;

  disabled: boolean;
};

const TableInput: React.FC<TableInputProps> = React.memo(
  (props) => {
    const [selectedRowIndex, setSelectedRowIndex] = React.useState(null);
    const {
      disabled,
    } = props;

    React.useEffect(
      () => {
        if (selectedRowIndex >= props.array.length) {
          setSelectedRowIndex(null);
        }
      },
      [props.array.length, selectedRowIndex],
    );

    const handleAddRow = React.useCallback(
      () => {
        props.onChange([
          ...props.array,
          props.meta.reduce((emptyRow, { key }) => {
            emptyRow[key] = null;

            return emptyRow;
          }, {}),
        ]);
      },
      [props.array, props.onChange],
    );

    const handleRemoveRow = React.useCallback(
      () => {
        props.onChange(
          props.array.filter((_, index) => index !== selectedRowIndex),
        );
      },
      [selectedRowIndex, props.onChange, props.array],
    );

    return (
      <React.Fragment>
        <DisplayFlexAlignCenterFooterForm>
          {
            props.visibleAdd
              && (
                <Button onClick={handleAddRow} disabled={disabled}>{props.addName || 'Добавить'}</Button>
              )
          }
          {
            props.visibleRemove
              && (
                <Button onClick={handleRemoveRow} disabled={selectedRowIndex === null || disabled}>{props.removeName || 'Удалить'}</Button>
              )
          }
        </DisplayFlexAlignCenterFooterForm>
        {
          Boolean(props.array.length)
            && (
              <EtsTable fixedWidth>
                <TableInputThead
                  meta={props.meta}
                />
                <TableInputTbody
                  meta={props.meta}
                  array={props.array}
                  errors={props.errors}
                  onChange={props.onChange}
                  selectedRowIndex={selectedRowIndex}
                  setSelectedRowIndex={setSelectedRowIndex}
                  disabled={disabled}
                />
              </EtsTable>
            )
        }
      </React.Fragment>
    );
  },
);

export default TableInput;
