import * as React from 'react';
import { isNullOrUndefined } from 'util';
import tachographFormTabKey from 'components/new/pages/nsi/autobase/pages/tachograph/form/body_container/formConfig';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import TachographFormLink from './TachographFormLink';
import TachographFormLinkNavDropdown from './TachographFormLinkNavDropdown';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

type OwnProps = {
  isPermitted: boolean;
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
          tachographFormTabKey.map(({ tabKey: tabKeyScheme, title, ...other }) => {
            const isActive = activeTabKey === tabKeyScheme;
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
