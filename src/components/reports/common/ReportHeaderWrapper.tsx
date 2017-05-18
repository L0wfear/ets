import * as React from 'react';
import { isEqual } from 'lodash';

import {
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
      };
    }
    componentWillReceiveProps(nextProps) {
      const { queryState } = nextProps;
      const queryStateLength = Object.keys(queryState).length;

      if (
        queryStateLength > 0 &&
        !isEqual(this.state, queryState)
      ) {
        this.setState({ ...queryState });
        return;
      }

      // if (queryStateLength === 0) {
      //   this.setState({ headerState: {} });
      // }
    }
    handleChange = (field: string, value: any) => {
      this.setState({
        [field]: value,
      });
    }
    render() {
      return (
        <SourceHeader
          {...this.props}
          {...this.state}
          handleChange={this.handleChange}
        />
      );
    }
  };
}

export default ReportHeaderWrapper;
