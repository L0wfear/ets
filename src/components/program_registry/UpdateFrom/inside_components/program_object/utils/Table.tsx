import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import {
  EtsTheadTh,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';

class TablePrev extends React.Component<any, any> {
  handleChange = (numRow, field, value) => {
    const {
      bodyData = [],
    } = this.props;

    const rowChange = {
      ...bodyData[numRow],
    };

    if (typeof value === 'object') {
      const {
        target: {
          value: eValue,
        },
      } = value;

      rowChange[field] = eValue;
    } else {
      rowChange[field] = value;
    }

    this.props.handleChangeInTable(rowChange);
  }

  handleClick = (e) => {
    const {
      currentTarget: {
        rowIndex,
      },
    } = e;

    this.props.handleRowClick(rowIndex);
  }

  render() {
    const {
      isPermitted,
      title = '',
      buttons = null,
      headerData = [],
      bodyData = [],
      selectedRow = null,
      mainPropsFields = {},
      errors,
    } = this.props;

    const tableProps: any = {
      bsClass: 'custom-table overflow-visible table',
    };

    return (
      <div style={{
        height: 100 + bodyData.length * 68,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          {title && <div>{title}</div>}
          {buttons && <div>{buttons}</div>}
        </div>
        {
          !!bodyData.length &&
          <table {...tableProps}>
            <thead>
              <tr>
                {
                  headerData.map(({ title: titleTH }, i) => (
                    <EtsTheadTh canClick width={400} key={i}>{titleTH}</EtsTheadTh>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {
                bodyData.map((row, numRow) => (
                  <tr onClick={this.handleClick} className={selectedRow === numRow ? 'sm-active' : null}key={numRow}>
                    {
                      headerData.map(({ key, style, otherProps }, numOne) => (
                          <td key={numOne} style={{ ...style(numRow, row, errors) }}>
                            <ExtField
                              {...mainPropsFields[key]}
                              value={row[key]}
                              onChange={this.props.handleChange}
                              boundKeys={[numRow, key]}
                              disabled={!isPermitted || mainPropsFields[key].disabled}
                              {...otherProps(numRow, row, errors)}
                            />
                          </td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
          </table>
        }
        </div>
    );
  }
}

export default TablePrev;
