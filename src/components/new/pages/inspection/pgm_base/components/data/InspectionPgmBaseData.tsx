import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { compose } from 'recompose';
import { InspectionPgmBaseDataProps, InspectionPgmBaseDataStateProps, InspectionPgmBaseDataDispatchProps, InspectionPgmBaseDataOwnProps } from './@types/InspectionPgmBaseData';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { DivNone } from 'global-styled/global-styled';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import InspectionPgmBaseDataActionMenu from './components/action_menu/InspectionPgmBaseDataActionMenu';
import InspectionPgmBaseDataRegistry from './components/registry/InspectionPgmBaseDataRegistry';
import AppleStyleBlock from 'components/new/ui/apple_style/AppleStyleBlock';

const InspectionPgmBaseData: React.FC<InspectionPgmBaseDataProps> = (props) => {
  const {
    isFirst,
    pgmBaseId,
  } = props;

  React.useEffect(
    () => {
      if (pgmBaseId) {
        props.actionGetAndSetInStoreInspectPgmBase(
          { pgmBaseId },
          { page: props.loadingPage },
        );
      }

      return () => {
        props.actionResetInspectPgmBaseList();
      };
    },
    [pgmBaseId],
  );

  return (
    pgmBaseId
      ? (
        <>
          <AppleStyleBlock delay={isFirst ? 1000 : 0}>
            <Row>
              <Col md={12}>
                <InspectionPgmBaseDataActionMenu
                  loadingPage={props.loadingPage}
                />
              </Col>
            </Row>
          </AppleStyleBlock>
          <AppleStyleBlock delay={(isFirst ? 1000 : 0) + 500}>
            <Row>
              <Col md={12}>
                <InspectionPgmBaseDataRegistry />
              </Col>
            </Row>
          </AppleStyleBlock>
        </>
      )
      : (
        <DivNone />
      )
  );
};

export default compose<InspectionPgmBaseDataProps, InspectionPgmBaseDataOwnProps>(
  connect<InspectionPgmBaseDataStateProps, InspectionPgmBaseDataDispatchProps, InspectionPgmBaseDataOwnProps, any, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetAndSetInStoreInspectPgmBase: (...arg) => (
        dispatch(
          inspectionActions.actionGetAndSetInStoreInspectPgmBase(...arg),
        )
      ),
      actionResetInspectPgmBaseList: (...arg) => (
        dispatch(
          inspectionActions.actionResetInspectPgmBaseList(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
)(InspectionPgmBaseData);
