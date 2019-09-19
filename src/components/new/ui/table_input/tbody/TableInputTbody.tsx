import * as React from 'react';
import { TableMeta } from '../TableInput';
import TableInputTbodyTr from './tr/TableInputTbodyTr';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

export type TableInputTbodyProps = {
  meta: TableMeta<any>[];
  array: any[];
  errors: any[];
  onChange: any;
  selectedRowIndex: number;
  setSelectedRowIndex: (indexRow: number) => any;
  disabled?: boolean;

  formDataKey?: FormKeys;
};

const TableInputTbody: React.FC<TableInputTbodyProps> = React.memo(
  (props) => {
    const handleChange = React.useCallback(
      (rowIndex, rowData) => {
        props.onChange(
          props.array.map((arrayItem, indexItem) => {
            if (indexItem === rowIndex) {
              return rowData;
            }

            return arrayItem;
          }),
        );
      },
      [props.array, props.onChange],
    );

    return (
      <tbody>
        {
          props.array.map((rowData, index) => (
            <TableInputTbodyTr
              key={index + 1}
              rowIndex={index}
              isSelected={index === props.selectedRowIndex}
              setSelectedRowIndex={props.setSelectedRowIndex}
              rowData={rowData}
              errors={props.errors[index]}
              meta={props.meta}
              onChange={handleChange}
              disabled={props.disabled}

              formDataKey={props.formDataKey}
            />
          ))
        }
      </tbody>
    );
  },
);

export default TableInputTbody;
