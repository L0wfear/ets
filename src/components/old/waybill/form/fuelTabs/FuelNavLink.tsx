/* eslint-disable no-tabs */
import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';
import { GlyphiconStyled } from 'components/new/ui/@bootstrap/01-glyphicon/EtsGlyphicon';

const FuelNavLinkStyled = styled(EtsBootstrap.NavItem)`
	&&&>a {
    font-size: 18px;
    display: inline-flex;
    align-items: center;
    ${GlyphiconStyled} {
      padding-right: 5px;
    }
  }
`;

type Props = {
	isActive: boolean;
	title: string;
	tabKey: string;
  handleTabChange: (tab: string) => any;
  tabHasErrors: boolean;
};

const FuelNavLink: React.FC<Props> = React.memo(
  (props) => {
    const {
      isActive,
      title,
      tabKey,
      tabHasErrors,
    } = props;

    const handleClick = React.useCallback(
      () => {
        props.handleTabChange(tabKey);
      },
      [tabKey, props.handleTabChange],
    );

    return (
      <FuelNavLinkStyled role="button" active={isActive} onClick={handleClick} tabHasErrors={tabHasErrors}>
        { tabHasErrors
          && <EtsBootstrap.Glyphicon glyph={'exclamation-sign'} />
        }
        {title}
      </FuelNavLinkStyled>
    );
  },
);

export default FuelNavLink;
