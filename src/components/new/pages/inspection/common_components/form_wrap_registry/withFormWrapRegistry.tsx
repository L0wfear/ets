import * as React from 'react';

import { createPortal } from 'react-dom';
import EtsBootstrap from 'components/new/ui/@bootstrap';
// import Registry from 'components/new/ui/registry/components/Registry';
import { PopupBottomForm, TitleForm, ContainerForm, FooterForm } from 'components/new/pages/inspection/common_components/form_wrap_check/styled';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { TypeConfigData, OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { GlobalFormSchemaType } from 'components/new/GlobalForms';
import { isNullOrUndefined } from 'util';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { WithformWrapRegistryWrapper } from 'components/new/pages/inspection/common_components/form_wrap_registry/styled';
import { FooterEnd } from 'global-styled/global-styled';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { registrySelectRowWithPutRequest } from 'components/new/ui/registry/module/actions-registy';

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
  const dispatch = etsUseDispatch();
  const selectedRow = etsUseSelector((state) => getListData(state.registry, props.registryConfig.registryKey).data.selectedRow);
  const saveIsDisable = selectedRow ? false : true;
  const list = etsUseSelector((state) => getListData(state.registry, props.registryConfig.registryKey));

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
      if (props.globalFormShema.dataInSearchKeyList.length) {
        const resetObj = props.globalFormShema.dataInSearchKeyList.reduce((accElem, currentElem) => ({
          ...accElem,
          [currentElem.key]: null,
        }), {});
        props.setDataInSearch(resetObj);
      }
    },
    [showForm, props.searchState, props.match.params, props.setDataInSearch, props.setParams],
  );
  const saveSelectedRow = React.useCallback(
    () => {
      const list_new: OneRegistryData['list'] = {
        ...list,
        data: {
          ...list.data,
          selectedRow: null,
        },
        rendersFields: {
          ...list.rendersFields,
          values: null,
        },
      };

      dispatch(registrySelectRowWithPutRequest(
        props.registryConfig.registryKey,
        list_new,
        list.rendersFields,
      ));
    },
    [selectedRow, props.registryConfig, showForm, props.searchState, props.match.params, props.setDataInSearch, props.setParams, list],
  );

  return isPermitted && createPortal(
    <WithformWrapRegistryWrapper z_index = {1001}>
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
          <FooterForm md={12} sm={12}>
            <FooterEnd>
              <EtsBootstrap.Button disabled={saveIsDisable} onClick={saveSelectedRow}>Сохранить выделенную запись</EtsBootstrap.Button>
              <EtsBootstrap.Button onClick={onFormHide}>Закрыть карточку</EtsBootstrap.Button>
            </FooterEnd>
          </FooterForm>
        </React.Fragment>
      }
      </PopupBottomForm>
    </WithformWrapRegistryWrapper>,
    document.getElementById('container'),
  );
};

export default compose<any, any>(
  withSearch,
  withRequirePermission({}),
)(WithInspectFormWrapRegistry);
