import * as React from 'react';
import {
  timeTransition,
  EtsCollapse,
} from 'components/ui/collapse/styled/styled';

type PropsCollapse = {
  isOpen: boolean;
  changeMaxHeight?: any;
  dependentData: any;
};

type StateCollapse = {

};

class Collapse extends React.Component<PropsCollapse, StateCollapse> {
  _node: any;
  state = {
    isOpen: this.props.isOpen,
    maxHeight: 0,
    overFlow: 'hidden',
    dependentData: this.props.dependentData,
    timerId: null,
  };

  componentDidMount() {
    if (this.state.isOpen) {
      const maxHeight = this._node.scrollHeight;
      this.setState({
        maxHeight,
      });

      if (this.props.changeMaxHeight) {
        this.props.changeMaxHeight(maxHeight);
      }
    }
    
  }

  static getDerivedStateFromProps({ isOpen, dependentData }, prevState) {
    if (isOpen || prevState.isOpen || dependentData !== prevState.dependentData ) {
      return {
        isOpen,
        dependentData,
      };
    }

    return null;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const scrollHeight = this._node.scrollHeight;
    return this.state.isOpen ? (scrollHeight < this.state.maxHeight ? this.state.maxHeight : scrollHeight) : 0;
  }

  componentDidUpdate(prevProps, prevState, maxHeight) {
    const { maxHeight: stateMaxHeight } = this.state;

    if (maxHeight !== stateMaxHeight) {
      this.asyncUpdateMaxHeight(maxHeight, stateMaxHeight);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.timerId);
  }

  asyncUpdateMaxHeight(maxHeight, stateMaxHeight) {
    new Promise(() => {
      const changeStateObj = {
        ...this.state,
        maxHeight,
      };

      if (this.props.changeMaxHeight) {
        this.props.changeMaxHeight(maxHeight - stateMaxHeight);
      }

      if (maxHeight > 0) {
        if (stateMaxHeight === 0) {
          changeStateObj.timerId = setTimeout(() => (
            this.setState({
              overFlow: 'visible',
            })
          ), timeTransition + 100);
        }
      } else {
        changeStateObj.overFlow = 'hidden';
      }

      this.setState(changeStateObj);
    });
  }

  changeMaxHeight = (childHeight) => {
    const maxHeight = this.state.maxHeight + childHeight;

    if (maxHeight !== this.state.maxHeight) {
      if (this.props.changeMaxHeight) {
        this.props.changeMaxHeight(maxHeight);
      }
      this.setState({
        maxHeight,
      });
    }
  }

  addPropsToChildren = (Component) => (
    <Component.type {...Component.props} changeMaxHeight={this.changeMaxHeight} />
  )

  getNode = node => this._node = node;

  render() {
    const {
      overFlow,
      maxHeight,
    } = this.state;

    return (
      <EtsCollapse maxHeight={maxHeight} overFlow={overFlow}>
        <div ref={this.getNode}>
          {
            React.Children.map(this.props.children, this.addPropsToChildren)
          }
        </div>
      </EtsCollapse>
    );
  }
}

export default Collapse;
