import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { DataTableHeadLine, DataTableHeadLineTitle } from 'components/old/ui/table/styled';
import Div from 'components/old/ui/Div';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
        <Div className="some-header" style={{ marginBottom: '10px', }}>
          <DataTableHeadLine>
            {title && <DataTableHeadLineTitle>{title}</DataTableHeadLineTitle>}
            {buttons && <div className="waybills-buttons">{buttons}</div>}
          </DataTableHeadLine>
        </Div>
        {
          !!bodyData.length &&
          <EtsBootstrap.TableOld>
            <EtsBootstrap.Grid.GridBootstrapThead.Thead>
              <EtsBootstrap.Grid.GridBootstrapThead.Tr className="ets_thead_tr">
                {
                  headerData.map(({ title: titleTH }, i) => (
                    <EtsBootstrap.Grid.GridBootstrapThead.Th canClick width={400} key={i}>{titleTH}</EtsBootstrap.Grid.GridBootstrapThead.Th>
                  ))
                }
              </EtsBootstrap.Grid.GridBootstrapThead.Tr>
            </EtsBootstrap.Grid.GridBootstrapThead.Thead>
            <EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
              {
                bodyData.map((row, numRow) => (
                  <EtsBootstrap.Grid.GridBootstrapTbody.Tr
                    registryKey={this.props.page}
                    key={numRow + 1}
                    enable
                    isSelected={false}
                    onClick={this.handleClick}
                    className={selectedRow === numRow ? 'sm-active' : null}
                  >
                    {
                      headerData.map(({ key, style, otherProps }, numOne) => (
                          <EtsBootstrap.Grid.GridBootstrapTbody.Td key={numOne + 1} style={{ ...style(numRow, row, errors) }}>
                            <ExtField
                              {...mainPropsFields[key]}
                              label={""}
                              minHeightLabel={0}
                              value={row[key]}
                              onChange={this.props.handleChange}
                              boundKeys={[numRow, key]}
                              disabled={!isPermitted || mainPropsFields[key].disabled}
                              {...otherProps(numRow, row, errors)}
                            />
                          </EtsBootstrap.Grid.GridBootstrapTbody.Td>
                      ))
                    }
                  </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
                ))
              }
            </EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
          </EtsBootstrap.TableOld>
        }
        </div>
    );
  }
}

export default TablePrev;
