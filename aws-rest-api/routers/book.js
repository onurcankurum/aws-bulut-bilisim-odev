const express = require('express');
const router = express.Router();

require('../db/db_connection');



const crud = require('../m_test');

const AWS = require("aws-sdk");


const DynamoDB = new AWS.DynamoDB();


router.get('/', (req, res) => {
    res.json({
        message: "book's page",
    });
});


//? insert book
router.post('/insert', (req, res) => {

    try {
        //  crud.addMovie("fartklı sayfa test","231321");
        const result = crud.inserBook(req.body);
        res.json({
            "message": "insert book successful"
        });
    } catch (err) {}
});

// get all book
router.get('/getAllBook', async(req, res) => {

    try {
        const result = await crud.getAllBook();

     //   console.log(result);

      var bookList = [];

      for(var i in result){
          console.log(result[i]);
        var book = book_bookModelJson(result[i]);
        bookList.push(book);
         
      }

        res.status(200).json(bookList);
    } catch (err) {
        res.status(400).json({ error: "get failed", code: err.toString() });
    }
});

function book_bookModelJson(msjon) {
    console.log("id : "+ msjon.id);
    return {  
        publisher_editor: msjon.publisher_editor.S,
        ideas: msjon.ideas.S,
        book_name: msjon.book_name.S,
        id: msjon.id =msjon.id.N,
        imgUrl: msjon.imgUrl.S,
        author: msjon.author.S
    }
}


//?update book
router.patch('/patch/:bookID', async(req, res) => {
    try {
        //  const result = await Music.findByIdAndUpdate({_id: req.params.musicID}, req.body, {new:true});
        var result = crud.updateBook(req.body);
        return res.status(200).json({ message: "updated" });

    } catch (err) {
        res.status(200).json({ error: "something went wrong" })
    }
});


//?delete book
router.delete('/delete/:bookID', async(req, res) => {


    var result = crud.deleteBook(req.params.bookID);

    result
        .then(result => {
            console.log("Order is deleted!", result.$response);

            return res.json({ message: "delete is succesful" });
        })
        .catch(deleteError => {
            console.log('Oops, order is not deleted :(', deleteError);
            return res.status(401).json({ message: "delete is failed" });
            //throw deleteError;
        });

});

module.exports = router;