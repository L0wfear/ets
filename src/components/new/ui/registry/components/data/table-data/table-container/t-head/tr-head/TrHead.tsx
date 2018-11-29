import * as React from 'react';

import TrTh from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/TrTh';

type PropsTrHead = {
  registryKey: string;
  thDataRow: any[];
};

type StateTrHead = {

};

class TrHead extends React.PureComponent<PropsTrHead, StateTrHead> {
  render() {
    return (
      <tr className="ets_thead_tr">
        {
          this.props.thDataRow.map((colData) => (
            <TrTh key={colData.key} colData={colData} registryKey={this.props.registryKey} />
          ))
        }
      </tr>
    );
  }
}

export default TrHead;
