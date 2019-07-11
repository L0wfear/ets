import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import {
  EtsTheadTh,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import { EtsThead } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/styled/styled';
import EtsTable from 'components/new/ui/@bootstrap/27-table/EtsTable';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';

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

    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          {title && <div>{title}</div>}
          {buttons && <div>{buttons}</div>}
        </div>
        {
          !!bodyData.length &&
          <EtsTable>
            <EtsThead>
              <tr className="ets_thead_tr">
                {
                  headerData.map(({ title: titleTH }, i) => (
                    <EtsTheadTh canClick width={400} key={i}>{titleTH}</EtsTheadTh>
                  ))
                }
              </tr>
            </EtsThead>
            <tbody>
              {
                bodyData.map((row, numRow) => (
                  <EtsTrTbody
                    registryKey={this.props.page}
                    key={numRow + 1}
                    enable
                    selected={false}
                    onClick={this.handleClick}
                    className={selectedRow === numRow ? 'sm-active' : null}
                    registryKey="main"
                  >
                    {
                      headerData.map(({ key, style, otherProps }, numOne) => (
                          <EtsTbodyTrTd key={numOne + 1} style={{ ...style(numRow, row, errors) }}>
                            <ExtField
                              {...mainPropsFields[key]}
                              value={row[key]}
                              onChange={this.props.handleChange}
                              boundKeys={[numRow, key]}
                              disabled={!isPermitted || mainPropsFields[key].disabled}
                              {...otherProps(numRow, row, errors)}
                            />
                          </EtsTbodyTrTd>
                      ))
                    }
                  </EtsTrTbody>
                ))
              }
            </tbody>
          </EtsTable>
        }
        </div>
    );
  }
}

export default TablePrev;
