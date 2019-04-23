import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { CompanyNameContainer } from './styled';

type AppFooterStateProps = {
  userData: InitialStateSession['userData'];
};
type AppFooterDispatchProps = DispatchProp;
type AppFooterOwnProps = {};
type AppFooterMergedProps = (
  AppFooterStateProps
  & AppFooterDispatchProps
  & AppFooterOwnProps
);
type AppFooterProps = AppFooterMergedProps;

const AppFooter: React.FC<AppFooterProps> = React.memo(
  (props) => {
    const {
      userData,
    } = props;

    const company_name = userData.company_name || '';
    const structure_name = userData.structure_name || '';

    return (
      <CompanyNameContainer>
        <span>{`${company_name} ${structure_name}`}</span>
      </CompanyNameContainer>
    );
  },
);

export default connect<AppFooterStateProps, AppFooterDispatchProps, AppFooterOwnProps, ReduxState>(
  (state) => ({
    userData: getSessionState(state).userData,
  }),
)(AppFooter);
