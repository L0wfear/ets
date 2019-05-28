import * as React from 'react';

import TrTh from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/TrTh';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { isArray } from 'util';

import {
  StatePropsTrHead,
  DispatchPropsTrHead,
  OwnPropsTrHead,
  PropsTrHead,
  StateTrHead,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/TrHead.h';
import { compose } from 'recompose';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

class TrHead extends React.PureComponent<PropsTrHead, StateTrHead> {
  mapThDataRow = (colData) => {
    const { title } = colData;

    let formatedTitle = title;

    if (isArray(title)) {
      formatedTitle = title.reduce((filtredTitle, titleSomeValue) => {
        const { displayIf } = titleSomeValue;

        if (displayIf === 'test') {
          return 'test';
        }

        return filtredTitle;
      }, null);
    }

    if (!formatedTitle && colData.key !== 'checkbox') {
      return null;
    }

    return (
      <TrTh key={colData.key} colData={colData} formatedTitle={formatedTitle} registryKey={this.props.registryKey} />
    );
  }
  render() {
    return (
      <tr className="ets_thead_tr">
        {
          this.props.thDataRow.map(this.mapThDataRow)
        }
      </tr>
    );
  }
}

export default compose<PropsTrHead, OwnPropsTrHead>(
  withSearch,
  connect<StatePropsTrHead, DispatchPropsTrHead, OwnPropsTrHead, ReduxState>(
    null,
  ),
)(TrHead);
