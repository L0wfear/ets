import * as React from 'react';
import { connect } from 'react-redux';
import { CarInfoBlock, CarInfoTitleSpanContainer, CarInfoClose } from 'components/old/monitor/styled';
import { compose } from 'recompose';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

type PropsTitleBlock = {
  gov_number: string;
  gps_code: string;
  handleClickOnClose: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
};

const TitleBlock: React.FC<PropsTitleBlock> = ({ gov_number, ...props }) => (
  <div className="map_info-title_container">
    <div></div>
    <CarInfoTitleSpanContainer>
      <CarInfoBlock>
        <span>{gov_number}</span>
      </CarInfoBlock>
    </CarInfoTitleSpanContainer>
    <CarInfoClose>
      <CarInfoBlock onClick={props.handleClickOnClose}>
        <span>x</span>
      </CarInfoBlock>
    </CarInfoClose>
  </div>
);

const mapStateToProps = (state) => ({
  gps_code: state.monitorPage.carInfo.gps_code,
  gov_number: state.monitorPage.carInfo.gov_number,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  handleClickOnClose: () => {
    ownProps.setParams({
      gov_number: null,
    });
  },
});

export default compose(
  withSearch,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(TitleBlock);
