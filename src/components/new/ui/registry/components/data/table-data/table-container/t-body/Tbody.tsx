import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import TrTbody from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/TrTbody';

type PropsTbody = {
  registryKey: string;
  processedArray: any[],
  paginator: {
    currentPage: number;
    perPage: number;
  };
  uniqKey: string;
};

type StateTbody = {

};

class Tbody extends React.Component<PropsTbody, StateTbody> {
  render() {
    const {
      paginator: {
        currentPage,
        perPage,
      },
    } = this.props;

    return (
      <tbody>
        {
          this.props.processedArray.slice(currentPage * perPage, (currentPage + 1) * perPage).map((rowData, indexRow) => (
            <TrTbody
              key={rowData[this.props.uniqKey]}
              rowData={rowData}
              registryKey={this.props.registryKey}
              indexRow={indexRow}
            />
          ))
        }
      </tbody>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  processedArray: getListData(state.registry, registryKey).processed.processedArray,
  uniqKey: getListData(state.registry, registryKey).data.uniqKey,
  paginator: getListData(state.registry, registryKey).paginator,
});

export default connect(
  mapStateToProps,
)(Tbody);
