import * as React from 'react';
import * as cx from 'classnames';

require('components/ui/collapse/Collapse.scss');

type PropsCollapse = {
  isOpen: boolean;
  changeMaxHeight?: Function;
  dependentData: any;
};

type StateCollapse = {

};

class Collapse extends React.Component<PropsCollapse, StateCollapse> {
  _node: any;
  state = {
    isOpen: this.props.isOpen,
    maxHeight: 0,
    dependentData: this.props.dependentData,
    style: {
      maxHeight: 0,
    }
  };

  componentDidMount() {
    if (this.state.isOpen) {
      const maxHeight = this._node.scrollHeight;
      this.setState({
        maxHeight,
        style: {
          maxHeight,
        },
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

  componentDidUpdate() {
    const scrollHeight = this._node.scrollHeight;

    const maxHeight = this.state.isOpen ? (scrollHeight < this.state.maxHeight ? this.state.maxHeight : scrollHeight) : 0;

    if (maxHeight !== this.state.maxHeight) {
      this.setState({
        maxHeight,
        style: {
          maxHeight,
        },
      });
      if (this.props.changeMaxHeight) {
        this.props.changeMaxHeight(maxHeight - this.state.maxHeight);
      }
    }
  }

  changeMaxHeight = (childHeight) => {
    const maxHeight = this.state.maxHeight + childHeight;

    if (maxHeight!== this.state.maxHeight) {
      if (this.props.changeMaxHeight) {
        this.props.changeMaxHeight(maxHeight);
      }
      this.setState({
        maxHeight,
        style: {
          maxHeight,
        },
      });
    }
  }
  
  addPropsToChildren = (Component) => (
    <Component.type {...Component.props} changeMaxHeight={this.changeMaxHeight} />
  )

  getNode = node => this._node = node;
  
  render() {
    return (
      <div className={cx('ets_collapse')} style={this.state.style}>
        <div ref={this.getNode}>
          {
            React.Children.map(this.props.children, this.addPropsToChildren)
          }
        </div>
      </div>
    )
  }
}

export default Collapse;
