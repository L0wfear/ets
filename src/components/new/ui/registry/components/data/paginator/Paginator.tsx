import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import * as Button from 'react-bootstrap/lib/Button';

import ButtonFirst from 'components/new/ui/registry/components/data/paginator/buttons/ButtonFirst';
import ButtonPrev from 'components/new/ui/registry/components/data/paginator/buttons/ButtonPrev';
import ButtonNext from 'components/new/ui/registry/components/data/paginator/buttons/ButtonNext';
import ButtonLast from 'components/new/ui/registry/components/data/paginator/buttons/ButtonLast';

import { registryChangeDataPaginatorCurrentPage } from 'components/new/ui/registry/module/actions-registy';
import { EtsPaginatorContainer } from 'components/new/ui/registry/components/data/paginator/styled/styled';
import { DivNone } from 'global-styled/global-styled';

type PropsPaginator = {
  registryKey: string;
  paginator: {
    currentPage: number;
    perPage: number;
  };
  processedArray: any[];
  total_count: number;

  registryChangeDataPaginatorCurrentPage: any;
  components?: any;
};

type StatePaginator = {
  processedArray: any[];
  perPage: number;
  countButtons: number;
  arrayForButton: number[];
};

class Paginator extends React.Component<PropsPaginator, StatePaginator> {
  constructor(props) {
    super(props);
    const { paginator: { perPage } } = props;

    const countButtons = Math.ceil(props.total_count / perPage);

    this.state = {
      processedArray: props.processedArray,
      countButtons,
      perPage,
      arrayForButton: Array(Math.min(countButtons, 11)).fill(1),
    };
  }

  static getDerivedStateFromProps(nextProps: PropsPaginator, prevState: StatePaginator) {
    const { processedArray, paginator: { perPage } } = nextProps;

    if (processedArray !== prevState.processedArray || perPage !== prevState.perPage) {
      const countButtons = Math.ceil(nextProps.total_count / perPage);

      return {
        processedArray,
        countButtons,
        perPage,
        arrayForButton: Array(Math.min(countButtons, 11)).fill(1),
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    /*
    if (this.state.processedArray !== prevState.processedArray || this.state.perPage !== prevState.perPage) {
      if (this.props.paginator.currentPage !== 0) {
        this.props.registryChangeDataPaginatorCurrentPage(0);
      }
    }

    */
  }

  handleButtonClick: any = ({ currentTarget: { dataset: { index } } }) => {
    const currentPageNext = Number(index);

    if (currentPageNext !== this.props.paginator.currentPage) {
      this.props.registryChangeDataPaginatorCurrentPage(currentPageNext);
    }
  }

  renderMainButton = (d, index) => {
    const { paginator: { currentPage } } = this.props;
    const { arrayForButton } = this.state;

    const arrayForButtonLength = arrayForButton.length;
    const halfButtonCount = Math.ceil(arrayForButtonLength / 2);

    let number = index;

    if (currentPage > halfButtonCount) {
      number = index + currentPage + 1 - halfButtonCount;
    }
    if (currentPage >= (this.state.countButtons - halfButtonCount)) {
      number = index + (this.state.countButtons - arrayForButtonLength);
    }

    return (
      <Button
        key={number}
        data-index={number}
        active={currentPage === number}
        onClick={this.handleButtonClick}
      >
        {number + 1}
      </Button>
    );
  }

  render() {
    const {
      registryKey,
      paginator,
    } = this.props;
    const { arrayForButton } = this.state;

    return Math.ceil(this.props.total_count / paginator.perPage) > 1
      ? (
        <EtsPaginatorContainer>
          <ButtonFirst registryKey={registryKey} />
          <ButtonPrev registryKey={registryKey}/>
          { arrayForButton.map(this.renderMainButton) }
          <ButtonNext registryKey={registryKey} />
          <ButtonLast registryKey={registryKey} />
        </EtsPaginatorContainer>
      )
      : (
        <DivNone />
      );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  processedArray: getListData(state.registry, registryKey).processed.processedArray,
  total_count: getListData(state.registry, registryKey).processed.total_count,
  paginator: getListData(state.registry, registryKey).paginator,
});

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  registryChangeDataPaginatorCurrentPage: (index) => (
    dispatch(
      registryChangeDataPaginatorCurrentPage(
        registryKey,
        index,
      ),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Paginator);
