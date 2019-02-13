import { detectIE } from 'utils/functions';

function tableFixHead(e, ie) {
  const el = e.target;
  const sT = el.scrollTop - 3;
  ie
    ? [...el.querySelectorAll('thead th')].forEach((th) => {
        th.style.transform = `translateY(${sT}px)`;
        th.style.transition = 'all .3s ease';
      })
    : [...el.querySelectorAll('thead th')].forEach((th) => {
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
  const allTableContainer = document.querySelectorAll(selector);
  const ie = detectIE(); // если ie

  [].forEach.call(allTableContainer, (el) => {
    addEventListener
      ? el.addEventListener('scroll', (e) => tableFixHead(e, ie))
      : el.removeEventListener('scroll', (e) => tableFixHead(e, ie));
  });
}
