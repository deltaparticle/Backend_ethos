const express = require('express');
const bodyParser = require('body-parser');
const ratingRoutes = require('./routes/rating');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api/rating', ratingRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
