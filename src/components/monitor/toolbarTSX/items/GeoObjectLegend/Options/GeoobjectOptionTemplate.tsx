import * as React from 'react';

type TOnClick = () => void;

export interface IPropsGeoobjectOptionTemplate {
  isActive: boolean;
  title: string;
  onClick: TOnClick;
}

class GeoobjectOptionTemplate extends React.Component<IPropsGeoobjectOptionTemplate, any> {
  render() {
    const { isActive, title } = this.props;

    return (
      <div className="status-filter_options option-with-checkbox" onClick={this.props.onClick}>
        <input type="checkbox" checked={isActive} />
        <span className="toolbar-with-checkbox">{`${title}`}</span>
      </div>
    );
  }
}

export default GeoobjectOptionTemplate;
