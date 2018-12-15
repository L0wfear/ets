import * as React from 'react';
import { ETSLogoSpan } from 'components/app_header/desktop/left/ets_logo/styled';

class EtsLogo extends React.Component<any, {}> {
  node = React.createRef<any>();

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.width < this.props.width) {
      const { current } = this.node;
      if (current) {
        return current.offsetWidth;
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      const { current } = this.node;
      if (current) {
        this.props.changeStaticWidth(current.offsetWidth - snapshot);
      }
    }
  }

  componentDidMount() {
    const { current } = this.node;

    if (current && this.props.changeStaticWidth) {
      this.props.changeStaticWidth(current.offsetWidth);
    }
  }

  render() {
    return (
      <ETSLogoSpan ref={this.node}>ЕТС</ETSLogoSpan>
    );
  }
}

export default EtsLogo;
