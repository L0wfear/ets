import html2canvas from 'html2canvas';

/**
 * Получение каваса с текстом
 * @param text текст
 * @param style стиль ('font-size: 10px;color: '#e26240'')
 */
export const getTextCanvas = async (text: string, style: string) => {
  const temp = document.createElement('span');
  temp.id = `${temp}_${Math.random()}`;
  temp.setAttribute('style', style);
  temp.innerHTML = text;

  const container = document.createElement('div');
  container.setAttribute('style', 'height:0px; position: absolute; z-index: -1; top:0');
  container.appendChild(temp);
  document.body.appendChild(container);

  const canvas = await html2canvas(temp, { scale: 2 });
  document.body.removeChild(container);

  return canvas;
};

/**
 * Получение скрина элемента
 * @param element элемента html
 */
export const getCanvasOfElement = (element: HTMLElement) => {
  return html2canvas(element, { scale: 2 });
};
