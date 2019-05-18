import * as React from 'react';
import { EtsTable, EtsTableWrapNoScroll } from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import TableInputThead from './thead/TableInputThead';
import TableInputTbody from './tbody/TableInputTbody';

import { EtsHeaderTitle } from '../registry/components/data/header/title/styled/styled';
import { EtsHeaderContainer } from '../registry/components/data/header/styled/styled';
import { EtsButtonsContainer } from '../registry/components/data/header/buttons/styled/styled';
import { EtsTableDataContainer } from '../registry/components/data/table-data/styled/styled';
import { ButtonTableInput } from './styled';
import EtsBootstrap from '../@bootstrap';

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
  resetIf?: {
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
  title: string;
  array: any[];
  errors: any[];
  onChange: any;
  addName?: string;
  addWidth?: number;
  addBlock?: boolean;
  visibleAdd: boolean;
  removeName?: string;
  removeWidth?: number;
  removeBlock?: boolean;
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
        <EtsBootstrap.Row>
          <EtsHeaderContainer>
            <EtsHeaderTitle>
              {props.title}
            </EtsHeaderTitle>
            <EtsButtonsContainer>
              {
                props.visibleAdd
                  && (
                    <ButtonTableInput block={props.addBlock} width={props.addWidth} onClick={handleAddRow} disabled={disabled}>{props.addName || 'Добавить'}</ButtonTableInput>
                  )
              }
              {
                props.visibleRemove
                  && (
                    <ButtonTableInput block={props.removeBlock} width={props.removeWidth} onClick={handleRemoveRow} disabled={selectedRowIndex === null || disabled}>{props.removeName || 'Удалить'}</ButtonTableInput>
                  )
              }
            </EtsButtonsContainer>
          </EtsHeaderContainer>
          {
            Boolean(props.array.length)
              && (
                <EtsTableDataContainer>
                  <EtsTableWrapNoScroll className="ets_table_wrap">
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
