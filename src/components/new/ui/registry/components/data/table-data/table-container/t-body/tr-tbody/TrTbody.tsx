import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import TrTd from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/TrTd';
import { EtsTrTbody } from './styled/styled';

type PropsTrTbody = {
  registryKey: string;
  rowData: any;
  rowFields: any[];
  indexRow: number;
};

type StateTrTbody = {

};

class TrTbody extends React.Component<PropsTrTbody, StateTrTbody> {
  renderRow = ({ key }) => (
    <TrTd
      key={key}
      indexRow={this.props.indexRow}
      rowData={this.props.rowData}
      metaKey={key}
      registryKey={this.props.registryKey}
    />
  );

  render() {
    return (
      <EtsTrTbody className="ets-tr" enable selected={false}>
        { this.props.rowFields.map(this.renderRow) }
      </EtsTrTbody>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  rowFields: getListData(state.registry, registryKey).meta.rowFields,
});

export default connect(
  mapStateToProps,
)(TrTbody);
