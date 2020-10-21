import * as React from 'react';
import { isNullOrUndefined } from 'util';
import tachographFormTabKey from 'components/new/pages/nsi/autobase/pages/tachograph/form/body_container/formConfig';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import TachographFormLink from './TachographFormLink';
import TachographFormLinkNavDropdown from './TachographFormLinkNavDropdown';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { checkErrorsIntoTab } from 'components/old/waybill/form/waybillFormTabConfig';

type OwnProps = {
  isPermitted: boolean;
  isCreating: boolean;
  errors: Record<string, any>;
};
type Props = (
  OwnProps
) & WithSearchProps;

const TachographFormBodyHeader: React.FC<Props> = React.memo(
  (props) => {
    const activeTabKey = props.match.params.tabKey;

    return (
      <EtsBootstrap.Nav
        bsStyle="tabs"
        id="refs-tachograph-tabs"
        activeKey={activeTabKey}
      >
        {
          tachographFormTabKey.filter((el) => props.isCreating ? el.tabKey === 'main' : el)
            .map(({ tabKey: tabKeyScheme, title, errorsFieldList, ...other }) => {
              const isActive = activeTabKey === tabKeyScheme;
              const tabHasErrors = checkErrorsIntoTab(props.errors, errorsFieldList);
              if ('children' in other) {
                const isActiveChildren = other.children.find((elem) => elem.tabKey === activeTabKey);
                const tachographFormTabKeyChildren = other.children;
                return (
                  <EtsBootstrap.NavDropdown key={tabKeyScheme} id={tabKeyScheme} eventKey={tabKeyScheme} title={title} active={!isNullOrUndefined(isActiveChildren)}>
                    {
                      tachographFormTabKeyChildren.map(({ tabKey: tabKeyChildScheme, title: titleChild }) => (
                        <TachographFormLinkNavDropdown
                          isActive={isActive}
                          tabKey={tabKeyChildScheme}
                          title={titleChild}
                          tabHasErrors={tabHasErrors}
                        />
                      ))
                    }
                  </EtsBootstrap.NavDropdown>
                );
              }
              return (
                <React.Fragment key={tabKeyScheme} >
                  <TachographFormLink
                    isActive={isActive}
                    tabKey={tabKeyScheme}
                    title={title}
                    tabHasErrors={tabHasErrors}
                  />
                </React.Fragment>
              );
            })
        }
      </EtsBootstrap.Nav>
    );
  },
);

export default withSearch<OwnProps>(TachographFormBodyHeader);
