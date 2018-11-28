function parseFilename(contentDisposition) {
  let filename;

  try {
    const result = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);

    if (result && result[1]) {
      filename = decodeURIComponent(result[1]);
    }
  } catch (e) {
    filename = null;
  }
  return filename;
}

export {
  parseFilename,
};
