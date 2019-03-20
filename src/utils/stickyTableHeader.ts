import { detectIE } from 'utils/functions';

function tableFixHead(el, selector) {
  const offsetTopIntoSelector = (
    selector === '.custom-table-container'
      ? 0
      : 3
  );
  const sT = el.scrollTop - offsetTopIntoSelector;
  [...el.querySelectorAll('thead th')].forEach((th) => {
    th.style.transform = `translateY(${sT}px)`;
    th.style.transition = 'all .3s ease';
  });
}

/**
 * липкая шапка для таблиц
 * @param {string} selector - селектор скролящегося контейнера(overflow: auto)
 * @param {boolean} addEventListener - добаить/удалить EventListener
 * @example setStickyThead('.data-table .griddle', true); // в componentDidMount
 */
export function setStickyThead(selector: string, addEventListener: boolean) {
  const allTableContainer = document.querySelectorAll(selector);
  const ie = detectIE(); // если ie
  if (ie) {
    [].forEach.call(allTableContainer, (el) => {
      addEventListener
        ? el.addEventListener('scroll', (e) => tableFixHead(e, selector))
        : el.removeEventListener('scroll', (e) => tableFixHead(e, selector));
    });
  }
}
