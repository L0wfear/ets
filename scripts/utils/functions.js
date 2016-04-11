export function isNotNull(value) {
  return typeof value !== 'undefined' && value !== null;
}

export function isEmpty(value) {
  if (!isNotNull(value)) return true;
  if (typeof value === 'string' && value.length === 0) return true;
  return false;
}

export function saveData(blob, fileName) {
  console.log('wwqwwqqwwq')
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function printData(blob) {
  let url = window.URL.createObjectURL(blob);

  let iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  iframe.style = "display: none";
  iframe.src = url;
  iframe.onload = () => {
    iframe.focus();
    iframe.contentWindow.print();
  }

  window.URL.revokeObjectURL(url);
}
