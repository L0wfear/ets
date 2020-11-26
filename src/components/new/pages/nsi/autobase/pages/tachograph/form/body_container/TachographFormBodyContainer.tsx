import * as React from 'react';

import { Route, Switch } from 'react-router-dom';
import tachographFormTabKey from './formConfig';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import RedirectTachographFormBody from './RedirectTachographFormBody';

type TachographFormBodyContainerOwnProps = {
  isPermitted: boolean;
  formState: TachographListWithOuterProps;
  formErrors: any;
  onChange: FormWithHandleChange<TachographListWithOuterProps>;
  onChangeBoolean: FormWithHandleChangeBoolean<TachographListWithOuterProps>;

  page: string;
  path: string;
};
type TachographFormBodyContainerProps = (
  TachographFormBodyContainerOwnProps
) & WithSearchProps;

const TachographFormBodyContainer: React.FC<TachographFormBodyContainerProps> = React.memo(
  (props) => {
    const {
      match,
    } = props;
    
    return (
      <EtsBootstrap.Row>
        <Switch>
          {
            tachographFormTabKey.map(({ tabKey: tabKeyScheme, title, ...other }) => {
              if ('children' in other) {
                return (
                  other.children.map(({ tabKey: tabKeyChildScheme, path, ...childrenOther }) => (
                    <Route
                      key={tabKeyChildScheme}
                      path={`${match.path.replace(':tabKey?', tabKeyChildScheme)}${path}`}
                      render={
                        () => (
                          <EtsBootstrap.Col md={12}>
                            <childrenOther.component
                              formState={props.formState}
                              selectedTachographData={props.formState}
                              formErrors={props.formErrors}
                              onChange={props.onChange}
                              onChangeBoolean={props.onChangeBoolean}
                              isPermitted={props.isPermitted}

                              page={props.page}
                              path={props.path}
                            />
                          </EtsBootstrap.Col>
                        )
                      } />
                  ))
                );
              }

              return (
                <Route
                  key={tabKeyScheme}
                  path={`${match.path.replace(':tabKey?', tabKeyScheme)}${other.path}`}
                  render={
                    () => (
                      <other.component
                        {...props}
                      />
                    )
                  }
                />
              );
            })
          }
          <RedirectTachographFormBody />
        </Switch>
      </EtsBootstrap.Row>
    );
  });

export default withSearch<TachographFormBodyContainerOwnProps>(TachographFormBodyContainer);
