try {
  require('dotenv').config({
    path: `${__dirname}/../.env`,
  });
} catch (err) {
  Error('Error trying to run file');
}
