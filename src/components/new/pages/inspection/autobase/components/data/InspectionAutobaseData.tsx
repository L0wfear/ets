import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { compose } from 'recompose';
import { InspectionAutobaseDataProps, InspectionAutobaseDataStateProps, InspectionAutobaseDataDispatchProps, InspectionAutobaseDataOwnProps } from './@types/InspectionAutobaseData';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { DivNone } from 'global-styled/global-styled';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import InspectionAutobaseDataActionMenu from './components/action_menu/InspectionAutobaseDataActionMenu';
import InspectionAutobaseDataRegistry from './components/registry/InspectionAutobaseDataRegistry';
import AppleStyleBlock from 'components/new/ui/apple_style/AppleStyleBlock';

const InspectionAutobaseData: React.FC<InspectionAutobaseDataProps> = (props) => {
  const {
    isFirst,
    carpoolId,
  } = props;

  React.useEffect(
    () => {
      if (carpoolId) {
        props.actionGetAndSetInStoreInspectAutobase(
          { carpoolId },
          { page: props.loadingPage },
        );
      }

      return () => {
        props.actionResetInspectAutobaseList();
      };
    },
    [carpoolId],
  );

  return (
    carpoolId
      ? (
        <>
          <AppleStyleBlock delay={isFirst ? 1000 : 0}>
            <Row>
              <Col md={12}>
                <InspectionAutobaseDataActionMenu
                  loadingPage={props.loadingPage}
                />
              </Col>
            </Row>
          </AppleStyleBlock>
          <AppleStyleBlock delay={(isFirst ? 1000 : 0) + 500}>
            <Row>
              <Col md={12}>
                <InspectionAutobaseDataRegistry />
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

export default compose<InspectionAutobaseDataProps, InspectionAutobaseDataOwnProps>(
  connect<InspectionAutobaseDataStateProps, InspectionAutobaseDataDispatchProps, InspectionAutobaseDataOwnProps, any, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetAndSetInStoreInspectAutobase: (...arg) => (
        dispatch(
          inspectionActions.actionGetAndSetInStoreInspectAutobase(...arg),
        )
      ),
      actionResetInspectAutobaseList: (...arg) => (
        dispatch(
          inspectionActions.actionResetInspectAutobaseList(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
)(InspectionAutobaseData);
