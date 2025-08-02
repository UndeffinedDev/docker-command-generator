import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.use(express.static('public'));


app.get('/api/docker-search', async (req, res) => {
    const query = req.query.q || '';
    const response = await fetch(`https://hub.docker.com/v2/search/repositories/?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    res.json(data);
  });

app.listen(80, () => {
    console.log('Server is running on port 80');
});
