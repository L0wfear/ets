export const parseFilename = (contentDisposition: string) => {
  try {
    const result = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);

    if (result && result[1]) {
      return decodeURIComponent(result[1]).replace(/['"]/g, '');
    }
  } catch (e) {
    return null;
  }
};
