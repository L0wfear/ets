import * as React from 'react';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';

export type PropsTrTd = {
  registryKey: string;
  rowData: any;
  metaKey: string;
  value: any;
};

type StateTrTd = {

};

class TrTd extends React.PureComponent<PropsTrTd, StateTrTd> {
  render() {
    return (
      <EtsTbodyTrTd>{this.props.value}</EtsTbodyTrTd>
    );
  }
}

export default TrTd;
