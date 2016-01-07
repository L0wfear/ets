import React from 'react';

class Paginator extends React.Component {

  constructor(props) {
    super(props);

    this.first = this.first.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.last = this.last.bind(this);
  }

  render() {
    const currentPage = this.props.currentPage;
    const maxPage = this.props.maxPage;

    if (maxPage === 1 || maxPage === 0) {
      return null;
    }

    let startIndex = Math.max(currentPage - 5, 0);
    const endIndex = Math.min(startIndex + 11, this.props.maxPage);

    if (maxPage >= 11 && (endIndex - startIndex) <= 10) {
      startIndex = endIndex - 11;
    }

    const options = [];

    // if(currentPage && maxPage >= 3 && currentPage !== 0 && currentPage !== 1) {
    //   options.push(
    //     <li className="aui-nav-first" key="first">
    //       <a className="pointer" onClick={this.first}>Первая</a>
    //     </li>
    //   );
    // }

    if (currentPage > 0) {
      options.push(
        <li className="aui-nav-previous" key="prev">
          <a className="pointer" onClick={this.previous}>Пред</a>
        </li>
      );
    }

    for (let i = startIndex; i < endIndex; i++) {
      const isSelected = currentPage === i;

      if (isSelected) {
        options.push(
          <li className="active" key={i}>
            <a className="pointer">{i + 1}</a>
          </li>
        );
      } else {
        options.push(
          <li key={i}>
            <a className="pointer" onClick={this.setPage(i)}>{i + 1}</a>
          </li>
        );
      }
    }

    if (currentPage < maxPage - 1) {
      options.push(
        <li className="aui-nav-previous" key="next">
          <a className="pointer" onClick={this.next}>След</a>
        </li>
      );
    }

    // if(maxPage >= 3 && currentPage !== maxPage - 1 && currentPage !== maxPage - 2) {
    //   options.push(
    //     <li className="aui-nav-last" key="last">
    //       <a className="pointer" onClick={this.last}>Последняя</a>
    //     </li>
    //   );
    // }

    return (
      <ol className="pagination">
        {options}
      </ol>
    );
  }

  setPage(i) {
    return e => {
      e.preventDefault();
      this.props.setPage(i);
    }
  }

  first(e) {
    e.preventDefault();
    this.props.setPage(0);
  }

  previous(e) {
    e.preventDefault();
    this.props.setPage(this.props.currentPage - 1);
  }

  next(e) {
    e.preventDefault();
    this.props.setPage(this.props.currentPage + 1);
  }

  last(e) {
    e.preventDefault();
    this.props.setPage(this.props.maxPage - 1);
  }

}


export default Paginator;
