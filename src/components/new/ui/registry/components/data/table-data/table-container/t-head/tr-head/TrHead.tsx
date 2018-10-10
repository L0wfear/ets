import * as React from 'react';
import { connect } from 'react-redux';

import TrTh from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/TrTh';

type PropsTrHead = {
  registryKey: string;
  thDataRow: any[];
};

type StateTrHead = {

};

class TrHead extends React.Component<PropsTrHead, StateTrHead> {
  render() {
    return (
      <tr className="ets_thead_tr">
        {
          this.props.thDataRow.map(colData => (
            <TrTh key={colData.key} colData={colData} registryKey={this.props.registryKey} />
          ))
        }
      </tr>
    );
  }
}

export default connect(
)(TrHead);
