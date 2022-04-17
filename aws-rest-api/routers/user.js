const express = require('express');
const router = express.Router();

require('../db/db_connection');
const bcrypt = require('bcrypt');


const crud = require('../m_test');

const AWS = require("aws-sdk");

var crypto = require('crypto');
const { json } = require('express');


const DynamoDB = new AWS.DynamoDB();


router.get('/', (req, res) => {
    res.json({
        message: "user's page",
    });
});

//?register
router.post('/register', async(req, res) => {


    console.log(req.body);
    console.log(req.body.user_password);

    const hashPW = await bcrypt.hash(req.body.user_password, 8);
    console.log("hash pw: " + hashPW);


    const data = req.body;
    data.user_password = hashPW;
    var array = [];
   
    data.user_book_list.forEach(element => {
        var child = {
            S: element
        };
        array.push(child);
    });
    
    data.user_book_list = array;

  

    try {

        const result = crud.register(data);
        res.json({
            "message": "register successful"
        });
    } catch (err) {}
});


//?update user
router.patch('/patch/:userID', async(req, res) => {
    try {
        //  const result = await Music.findByIdAndUpdate({_id: req.params.musicID}, req.body, {new:true});
        var result = crud.updateUser(req.body);
        console.log(result.toString());
        return res.status(200).json({ message: "updated" });


    } catch (err) {
        res.status(400).json({ error: "something went wrong" })
    }
});



router.post('/login', async(req, res) => {

    // console.log(req.body);
    try {

        const result = await crud.login();
        var email = req.body.user_email;
        //  console.log("gelen veri" + result);
        var password = req.body.user_password;


        objDATA = JSON.stringify(result);
        jsonDATA = JSON.parse(objDATA);

        var message;

        for (var i in jsonDATA) {
            //   console.log(jsonDATA[i]);
            //   console.log(i.toString());
            if (jsonDATA[i].user_email.S == email) {

                //       const passwordControl = await bcrypt.compare(req.body.user_password, user.user_password);

                const passwordControl = await bcrypt.compare(password, jsonDATA[i].user_password.S);
                if (passwordControl) {
                    //   console.log("login success");
                    message = "login succes";
                    return res.status(200).json({ 
                        message: message,
                        id: jsonDATA[i].id.S
                     });
                    break;
                } else {
                    //  console.log("wrong password");
                    message = "wrong password";
                    break;

                }
            } else {
                message = "user not found";
            }

        }
        return res.status(200).json({
             message: message ,
             id: ""
            });

    } catch (err) {}
});

module.exports = router;