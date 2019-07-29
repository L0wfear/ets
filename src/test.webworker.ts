// https://developer.mozilla.org/ru/docs/Web/API/Web_Workers_API
// https://habr.com/ru/company/ruvds/blog/348424/
const TestWebWorker: Worker = self as any;

// Нельзя передавать функции
TestWebWorker.addEventListener("message", (event) => {
  const { data } = event;
  console.log(data.message); // tslint:disable-line:no-console

  if (data.type === 'calc') {
    TestWebWorker.postMessage({ message: 'Hello, bro, too!' });
  }
});
