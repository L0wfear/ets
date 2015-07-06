let config = null;

if (process.env.NODE_ENV === 'production') {

  config = {
    backend: null, // same server
    images: '/data/images/'
  };

} else {

  config = {
    backend: 'http://localhost:5000',
    images: 'http://localhost:5000/data/images/'
  };

}

export default config;
