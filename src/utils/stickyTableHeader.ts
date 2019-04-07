import { detectIE } from 'utils/functions';

function tableFixHead(el, selector) {
  const offsetTopIntoSelector = (
    selector === '.custom-table-container'
      ? 0
      : 3
  );
  const sT = el.scrollTop - offsetTopIntoSelector;

  Array.from(el.querySelectorAll('thead th')).forEach((th: any) => {
    th.style.transform = `translateY(${sT}px)`;
  });
}

/**
 * липкая шапка для таблиц
 * @param {string} selector - селектор скролящегося контейнера(overflow: auto)
 * @param {boolean} addEventListener - добаить/удалить EventListener
 * @example setStickyThead('.data-table .griddle', true); // в componentDidMount
 */
export function setStickyThead(selector: string, addEventListener: boolean) {
  if (detectIE()) {
    Array.from(document.querySelectorAll(selector)).forEach((el) => {
      addEventListener
        ? el.addEventListener('scroll', (e) => tableFixHead(e.target, selector))
        : el.removeEventListener('scroll', (e) => tableFixHead(e.target, selector));
    });
  }
}
