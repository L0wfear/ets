import * as React from 'react';

import TrTh from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/TrTh';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { isArray } from 'util';

import {
  StatePropsTrHead,
  DispatchPropsTrHead,
  OwnPropsTrHead,
  PropsTrHead,
  StateTrHead,
} from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/TrHead.h';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';

class TrHead extends React.PureComponent<PropsTrHead, StateTrHead> {
  mapThDataRow = (colData) => {
    const { title } = colData;

    let formatedTitle = title;

    if (isArray(title)) {
      formatedTitle = title.reduce((filtredTitle, titleSomeValue) => {
        const { displayIf } = titleSomeValue;

        if (displayIf === displayIfContant.isKgh && this.props.userData.isKgh) {
          return titleSomeValue.title;
        }
        if (displayIf === displayIfContant.isOkrug && this.props.userData.isOkrug) {
          return titleSomeValue.title;
        }
        if (displayIf === displayIfContant.lenghtStructureMoreOne && this.props.STRUCTURES.length) {
          return titleSomeValue.title;
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

export default connect<StatePropsTrHead, DispatchPropsTrHead, OwnPropsTrHead, ReduxState>(
  (state) => ({
    STRUCTURES: getSessionStructuresOptions(state),
    userData: getSessionState(state).userData,
  }),
)(TrHead);
