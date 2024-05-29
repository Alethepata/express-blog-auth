const express = require('express');
const app = express();
const port = 3000;

const postsRouter = require('./routers/posts.js');
const homeRouter = require('./routers/home.js');

const {notFound, serverError} = require('./middleware/errors.js');


app.use(express.static('public'));

// app.use(express.urlencoded({extended: true}));

app.use('/', homeRouter);

app.use('/posts', postsRouter);

app.use(notFound);

app.use(serverError);

app.listen(port, () => {
    console.log('Server Online')
});
