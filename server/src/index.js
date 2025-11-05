import dotenv from 'dotenv';
import app from './app.js';
import connectDb from './DB/index.js';
dotenv.config();

const port = process.env.PORT;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server Listening in on http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error('Mongo COnnection Error');
    process.exit(1);
  });
