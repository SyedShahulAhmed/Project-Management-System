import express from 'express';
import cors from 'cors';
const app = express();

app.use(
  express.json({
    limit: '16kb',
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  })
);
app.use(express.static('public'));

app.use(cors(
    {
        origin : process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods : ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
        credentials : true,
        allowedHeaders : ['Content-Type', 'Authorization'],
    }
))

app.get('/', (req, res) => {
  res.send('This is a Express Server');
});

export default app;
