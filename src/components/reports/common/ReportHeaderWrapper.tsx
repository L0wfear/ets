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
    constructor(props) {
      super(props);
      this.state = {
        lastQueryState: this.props.queryState,
        ...this.props.queryState,
      };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const { queryState } = nextProps;
      const queryStateLength = Object.keys(queryState).length;

      console.log(queryState, prevState.lastQueryState, !isEqual(prevState.lastQueryState, queryState))
      console.log(queryStateLength > 0 && !isEqual(prevState.lastQueryState, queryState))
      if (queryStateLength > 0 && !isEqual(prevState.lastQueryState, queryState)) {
        return {
          ...queryState,
          lastQueryState: queryState,
        };
      }
      return null;
    }

    handleChange = (field: string, value: any) => {
      this.setState({
        [field]: value,
      });
    }
    render() {
      console.log(this.state)
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
