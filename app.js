// main server file is usually called app.js
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https"); //requiring the https module
const app = express();

app.use(express.static("public"));//for node to serve up static files we need to use this. Static folder is called "public"- we can name whatever we want. all static files go here
app.use(bodyParser.urlencoded({extended: true}));// first time we used this was on calculator web app. here we are setting up body-parser first

app.get("/", function(req , res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res){    //user input. this is post requst for our homeroute
         var firstName = req.body.fName;
         var lastName = req.body.lName;
         var email = req.body.email;
         const data = { // creatint javascript object. we are gonna write key value pairs that mailchimp is goign to recognize. json data comes from here/got built here
             members: [ {  //this members has to be an array of objects 
                         email_address: email,    // opening up another set of objects. single object becuase we are subscribing one person at a time. we using email key. the value of this key will be from the email value from the post request above "request.body.email"
                         status: "subscribed", // string
                         merge_fileds:    {    // object
                                FNAME: firstName, // FNAME is from mailchimp, firstName is from var that was created above
                                LNAME: lastName,  // lastName is from the form, just like firstName var above
                                }           
                                }               
                                ]
                                };
                                const jsonData = JSON.stringify(data) //'data' is from var above turning the above js into json string form. this json data is what we will be sending to mailchimp
                                const url = "https://us10.api.mailchimp.com/3.0/lists/c27cbafb3c";  //the url is going to come from the main mailchimp endpoint           
                                const options = { // js object 
                                   method: "POST", // the most important option to specify is the method. settin method to POST
                                   auth: "angela1:6afd30197f3e10397c8491c2d7fb0f47-us10"                // performing authentication. auth is key words from the node docs. you can put here whatever for user such as angela1
                                
                                }
                                //1:52 LO
                                //we are specififying that we are looking for any data that we get sent back from the mailchimp server
                                const request = https.request(url, options, function(response) {//creating our request within the app.post. Passing in our url, then passing in our options then finally a call back function that will give us a response from the mailchimp server. we r calling the const request to not conflict with the req keyword in the callbacl function in the app.post() above
                                    if (response.statusCode === 200) {
                                        res.sendFile(__dirname + "/success.html");

                                    } else {
                                        res.sendFile(__dirname + "/failure.html");
                                    }

                                    response.on("data", function(data){               //making http request and when we get back a response we are gonna check what kind of data they sent us 
                                    console.log(JSON.parse(data));  
                                    });
                                    });  
                        request.write(jsonData);// passing in the jsonData to the mailchimp server          
                        request.end();
                    });
app.post("/failure", function(req, res){ // since our form in html file is a post action. this triggers a post request to the failure route 
  res.redirect("/")
})          
//next step is make our request. we are posting data to an external resource
app.listen(process.env.PORT || 3000, function(){// completion handler that redirects the user to the homeroute. this is a dynamci port that heroku will define on the go. but also running on local host
    console.log("server coo");
    });

// 6afd30197f3e10397c8491c2d7fb0f47-us10 api key
// c27cbafb3c  list id 