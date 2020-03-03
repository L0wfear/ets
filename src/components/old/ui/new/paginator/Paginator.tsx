import * as React from 'react';
import * as cx from 'classnames';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type Props = {
  currentPage: number;
  maxPage: number;
  setPage: (pageNumber: number) => any;
};

class Paginator extends React.Component<Props, any> {
  componentDidUpdate(prevProps) {
    const { currentPage, maxPage } = this.props;

    if (maxPage && currentPage >= maxPage) {
      this.props.setPage(maxPage - 1);
    }
  }
  setPageFromA: React.MouseEventHandler<HTMLAnchorElement> = ({
    currentTarget: {
      dataset: { index },
    },
  }) => {
    this.props.setPage(Number(index));
  };

  first = (e) => {
    e.preventDefault();
    this.props.setPage(0);
  };

  previous = (e) => {
    e.preventDefault();
    this.props.setPage(this.props.currentPage - 1);
  };

  next = (disabled, e) => {
    e.preventDefault();
    if (disabled) {
      return;
    }
    this.props.setPage(this.props.currentPage + 1);
  };

  last = (e) => {
    e.preventDefault();
    this.props.setPage(this.props.maxPage - 1);
  };

  render() {
    const currentPage = this.props.currentPage;
    const maxPage = this.props.maxPage;

    if (maxPage === 1 || maxPage === 0) {
      return null;
    }

    let startIndex = Math.max(currentPage - 5, 0);
    const endIndex = Math.min(startIndex + 11, this.props.maxPage);

    if (maxPage >= 11 && endIndex - startIndex <= 10) {
      startIndex = endIndex - 11;
    }

    const options = [];

    if (currentPage && maxPage >= 3 && currentPage !== 0) {
      options.push(
        <li className="aui-nav-first" key="first">
          <a className="pointer" onClick={this.first}>
            Первая
          </a>
        </li>,
      );
    }

    if (currentPage > 0) {
      options.push(
        <li className="aui-nav-previous" key="prev">
          <a className="pointer pagination-control" onClick={this.previous}>
            <EtsBootstrap.Glyphicon glyph="chevron-left" />
          </a>
        </li>,
      );
    }

    for (let i = startIndex; i < endIndex; i++) {
      const isSelected = currentPage === i;

      if (isSelected) {
        options.push(
          <li className="active" key={i}>
            <a className="pointer">{i + 1}</a>
          </li>,
        );
      } else {
        options.push(
          <li key={i}>
            <a className="pointer" data-index={i} onClick={this.setPageFromA}>
              {i + 1}
            </a>
          </li>,
        );
      }
    }

    if (currentPage < maxPage - 1) {
      const nextClasses = cx('pointer pagination-control', {
        disabled: !(currentPage < maxPage - 1),
      });
      options.push(
        <li className="aui-nav-previous" key="next">
          <a
            className={nextClasses}
            onClick={this.next.bind(this, !(currentPage < maxPage - 1))}>
            <EtsBootstrap.Glyphicon glyph="chevron-right" />
          </a>
        </li>,
      );
    }

    if (maxPage >= 3 && currentPage !== maxPage - 1) {
      options.push(
        <li className="aui-nav-last" key="last">
          <a className="pointer" onClick={this.last}>
            Последняя
          </a>
        </li>,
      );
    }

    return <ol className="pagination">{options}</ol>;
  }
}

export default Paginator;
