import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { DefaultOwnPropsToBodyRoute } from 'components/new/pages/nsi/autobase/pages/tachograph/form/@types/TachographForm';
import styled from 'styled-components';
import { GlyphiconStyled } from 'components/new/ui/@bootstrap/01-glyphicon/EtsGlyphicon';

const NavLinkStyled = styled(EtsBootstrap.NavItem as any)`
&&&>a {
    display: inline-flex;
    align-items: center;
    ${GlyphiconStyled} {
      padding-right: 5px;
    }
  }
`;

type Props = DefaultOwnPropsToBodyRoute & WithSearchProps;

const TachographFormLink: React.FC<Props> = React.memo(
  (props) => {
    const {
      isActive,
      title,
      tabKey,
      tabHasErrors,
    } = props;

    const handleClick = React.useCallback(
      () => {
        props.setParams({
          tabKey,
        });
      },
      [tabKey, props.setParams, props.match.params],
    );

    return (
      <NavLinkStyled role="button" active={isActive} onClick={handleClick} tabHasErrors={tabHasErrors}>
        { tabHasErrors
          && <EtsBootstrap.Glyphicon glyph={'exclamation-sign'} />
        }
        {title}
      </NavLinkStyled>
    );
  },
);

export default withSearch<DefaultOwnPropsToBodyRoute>(TachographFormLink);
