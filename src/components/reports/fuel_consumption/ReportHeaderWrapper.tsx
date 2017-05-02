import * as React from 'react';

interface IReportHeaderWrapperState {
  str: string;
}

function ReportHeaderWrapper<IProps>
(SourceHeader: React.ComponentClass<IProps>): React.ComponentClass<IProps & IReportHeaderWrapperState> {
  return class Header extends React.Component<IProps & IReportHeaderWrapperState, IReportHeaderWrapperState> {
    render() {
      return (
        <SourceHeader
          {...this.props}
        />
      );
    }
  };
}

export default ReportHeaderWrapper;
