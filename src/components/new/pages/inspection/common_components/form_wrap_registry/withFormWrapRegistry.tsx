import * as React from 'react';

import { createPortal } from 'react-dom';
import EtsBootstrap from 'components/new/ui/@bootstrap';
// import Registry from 'components/new/ui/registry/components/Registry';
import { PopupBottomForm, HiddenPageEtsContainer, TitleForm, ContainerForm } from 'components/new/pages/inspection/common_components/form_wrap_check/styled';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { GlobalFormSchemaType } from 'components/new/GlobalForms';
import { isNullOrUndefined } from 'util';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';

type InspectionFormWrapStateProps = {};
type InspectionFormWrapDispatchProps = {
};
type InspectionFormWrapOwnProps = {
  registryConfig: {
    registryKey: string;
    getConfig: TypeConfigData<any>;
  };
  title: string;
  globalFormShema: GlobalFormSchemaType;
  registryComponent: any;
};
type InspectionFormWrapMergedProps = (
  InspectionFormWrapStateProps
  & InspectionFormWrapDispatchProps
  & InspectionFormWrapOwnProps
  & WithSearchProps
  & {
    isPermitted: boolean;
  }
);

const WithInspectFormWrapRegistry = (props: InspectionFormWrapMergedProps) => {
  const { isPermitted } = props;

  React.useEffect(() => {
    if ( !isPermitted ) {
      props.globalFormShema.dataInSearchKeyList.forEach((elem) => {
        if (!isNullOrUndefined(props.searchState[elem.key])) {
          props.setDataInSearch({
            [elem.key]: null,
          });
        }
      });
    }
  }, [props.searchState, props.match.params, props.setDataInSearch, props.setParams]);

  const showForm = React.useMemo(() => {
    return props.globalFormShema.dataInSearchKeyList.every((elem) => {
      if (elem.required) {
        return !isNullOrUndefined(props.searchState[elem.key]);
      }
      return true;
    });
  }, [props.globalFormShema, props.searchState, props.match.params, props.setDataInSearch, props.setParams]);

  const onFormHide = React.useCallback(
    () => {
      props.globalFormShema.dataInSearchKeyList.forEach((elem) => {
        props.setDataInSearch({
          [elem.key]: null,
        });
      });
    },
    [showForm, props.searchState, props.match.params, props.setDataInSearch, props.setParams],
  );

  return isPermitted && createPortal(
    <HiddenPageEtsContainer z_index = {1001}>
      <PopupBottomForm show={showForm}>
      {
        <React.Fragment>
          <TitleForm md={12} sm={12}>
            <h4>{props.title}</h4>
            <EtsBootstrap.Button onClick={onFormHide}>
              <EtsBootstrap.Glyphicon glyph="remove" />
            </EtsBootstrap.Button>
          </TitleForm>
          <ContainerForm>
            <EtsBootstrap.Col md={12}>
              <BoxContainer>
                {props.registryComponent}
              </BoxContainer>
            </EtsBootstrap.Col>
          </ContainerForm>
        </React.Fragment>
      }
      </PopupBottomForm>
    </HiddenPageEtsContainer>,
    document.getElementById('container'),
  );
};

export default compose<any, any>(
  withSearch,
  withRequirePermissionsNew({
    withIsPermittedProps: true,
  }),
)(WithInspectFormWrapRegistry);
