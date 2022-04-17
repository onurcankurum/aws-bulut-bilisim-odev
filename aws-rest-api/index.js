const express = require('express');
const app = express();

const bookRouter = require('./routers/book');
const userRouter = require('./routers/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {

    res.json({
        message: "welcome Library's rest api",
    });
});

app.use('/book', bookRouter);
app.use('/user', userRouter);


app.listen(3000);