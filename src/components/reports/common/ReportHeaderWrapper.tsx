import * as React from 'react';
import { isEqual, pick } from 'lodash';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
  IStateReportHeaderWrapper,
} from './@types/ReportHeaderWrapper.h';


function ReportHeaderWrapper(SourceHeader: any):
React.ComponentClass<IPropsReportHeaderWrapper & IStateReportHeaderWrapper> {
  type IPropsHeader = IPropsReportHeaderWrapper & IStateReportHeaderWrapper;

  return class Header extends React.Component<IPropsHeader, IStateReportHeaderWrapper> {
    clonedState: any;
    constructor() {
      super();
      this.state = {
        headerState: {},
      };
    }
    componentWillReceiveProps(nextProps) {
      const { queryState } = nextProps;
      const queryStateLength = Object.keys(queryState).length;

      if (
        queryStateLength > 0 &&
        !isEqual(this.state, queryState)
      ) {
        this.setState({ headerState: queryState });
        return;
      }

      // if (queryStateLength === 0) {
      //   this.setState({ headerState: {} });
      // }
    }
    handleChange = (field: string, value: any) => {
      this.setState({
        headerState: {
          ...this.state.headerState,
          [field]: value,
        },
      });
    }
    render() {
      return (
        <SourceHeader
          {...this.props}
          {...this.state.headerState}
          handleChange={this.handleChange}
        />
      );
    }
  };
}

export default ReportHeaderWrapper;
