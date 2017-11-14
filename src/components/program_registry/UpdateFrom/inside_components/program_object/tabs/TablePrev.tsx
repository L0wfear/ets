import * as React from 'react';
import { Table } from 'react-bootstrap';
import { ExtField } from 'components/ui/Field';

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

  render() {
    const {
      isPermitted,
      title = '',
      buttons = null,
      headerData = [],
      bodyData = [],
      mainPropsFields = {},
    } = this.props;
    return (
      <div style={{
        height: 150 + bodyData.length * 68,
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
          <Table bsClass="overflow-visible table" responsive>
            <thead>
              <tr>
                {
                  headerData.map(({ title: titleTH }, i) => (
                    <th key={i} style={{ textAlign: 'centre' }}>{titleTH}</th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {
                bodyData.map((row, numRow) => (
                  <tr key={numRow}>
                    {
                      headerData.map(({ key, style }, numOne) => (
                          <td key={numOne} style={{ ...style }}>
                            <ExtField
                              {...mainPropsFields[key]}
                              value={row[key]}
                              onChange={this.props.handleChange}
                              boundKeys={[numRow, key]}
                              disabled={!isPermitted}
                            />
                          </td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
          </Table>
        }
        </div>
    );
  }
}

export default TablePrev;
