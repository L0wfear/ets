import * as React from 'react';
import { EtsTable, EtsTableWrapNoScroll } from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import TableInputThead from './thead/TableInputThead';
import TableInputTbody from './tbody/TableInputTbody';
import { EtsTableDataContainer } from '../registry/components/data/table-data/styled/styled';
import { Row } from 'react-bootstrap';

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
  array: any[];
  errors: any[];
  onChange: any;

  header: any;
  selectedRowIndex: number;
  setSelectedRowIndex: any;

  disabled: boolean;
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

    return (
      <React.Fragment>
        {
          props.header
        }
        <br />
        <Row>
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
                        selectedRowIndex={props.selectedRowIndex}
                        setSelectedRowIndex={props.setSelectedRowIndex}
                        disabled={disabled}
                      />
                    </EtsTable>
                  </EtsTableWrapNoScroll>
                </EtsTableDataContainer>
              )
          }
        </Row>
      </React.Fragment>
    );
  },
);

export default TableInput;
