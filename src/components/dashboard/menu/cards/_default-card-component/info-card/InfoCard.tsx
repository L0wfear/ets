import * as React from 'react';

require('components/dashboard/menu/cards/_default-card-component/info-card/InfoCard.scss');

type PropsInfoCard = {
  title: React.ReactNode;
  handleClose: React.MouseEventHandler<HTMLDivElement>;
};

const InfoCard: React.SFC<PropsInfoCard> = props => (
  <div className="info_card_wrap">
    <div className="info_card card_container info">
      <div className="card_title">
        <div>
          <div>{props.title}</div>
          <div className="pointer" onClick={props.handleClose}>X</div>
        </div>
      </div>
      <div className="card_body">
        { props.children }
      </div>
    </div>
  </div>
);

export default InfoCard;
