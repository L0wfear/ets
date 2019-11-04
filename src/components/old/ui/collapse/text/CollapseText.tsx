import * as React from 'react';
import {
  CollapseContainer,
  CollapseTitleContainer,
} from 'components/old/ui/collapse/text/styled/styled';

import Collapse from 'components/old/ui/collapse/Collapse';
import { isObject } from 'util';

type PropsCollapseText= {
  classNameTitle?: string;
  title: any;
  classNameContainer?: string;
  components?: {
    CollapseContainer?: any;
    CollapseTitleContainer?: any;
  };
  noClickOnTitle?: boolean;
};

type StateCollapseText= {
};

class CollapseText extends React.Component<PropsCollapseText, StateCollapseText> {
  state = {
    isOpen: false,
  };

  toggleIsOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const { props, state } = this;
    const { components } = props;

    const Container = isObject(components) && components.CollapseContainer || CollapseContainer;
    const ContainerTitle = isObject(components) && components.CollapseTitleContainer || CollapseTitleContainer;

    return (
      <Container isOpen={state.isOpen}>
        <ContainerTitle noClickOnTitle={props.noClickOnTitle} onClick={this.toggleIsOpen}>{props.title}</ContainerTitle>
        <Collapse {...this.props} isOpen={this.state.isOpen}/>
      </Container>
    );
  }
}

export default CollapseText;
