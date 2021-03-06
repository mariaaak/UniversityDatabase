const express = require('express');
const mongoose = require('mongoose');
var mongoUrl = "mongodb://m_kuzhippallil:A00442283@localhost:/m_kuzhippallil";
const University = require('../serverside/models/university')


mongoose.set('useFindAndModify', false);

const app = express();
const SERVER_PORT = 8136;

var allowCrossDomain = function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
};

app.listen(SERVER_PORT,function(){
    console.log('Server Started');
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

//app.set('views', path.join(__dirname, 'cside'));  // add this one, change 'views' for your folder name if needed.
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/clientside');

app.use('/', express.static(__dirname));

app.get('/',async function(req,res){
    res.render('main.html')
})

app.get('/getUniversities',async(req,res)=>{

    try{
        const universities = await University.find()
        console.log("GET UNIVERSITIES !")
        res.json(universities)
        //return res.render('main.html',{ data: universities })
    }
    catch(err){
        res.send('Error - '+err)
    }
    
})

app.post('/getUniversity',async function (req,res){
    console.log("GET UNIVERSITY !")
    console.log(req.body)
    try{
        const response = await University.find({ 'name' : { '$regex' : req.body.name, '$options' : 'i' } })
        console.log(response)
        res.json(response)
    }
    catch(err){
        res.send('Error - '+ err)
    }
} )

app.post('/',async function (req,res){
    console.log("POST UNIVERSITY")

    const university = new University({
        name:req.body.name,
        address:req.body.address,
        phone:req.body.phone
    })

    try{
        const response = await university.save()
        console.log(response)
        res.json(response)
    }
    catch(err){
        res.send('Error - '+ err)
    }
})

app.post('/deleteUniversity',async function(req,res){

    console.log("DELETE UNIVERSITY !")
    console.log(req.body)
    University.findOneAndRemove({ 'name' : req.body.name} ,
        function (err, response) {
            if (err){
                res.send('Error - '+ err)
            }
            else{
                console.log(response)   
                res.json(response)
        }
    });

})

app.post('/updateUniversity', async function(req,res){
    console.log("UPDATE UNIVERSITY")
    University.findOneAndUpdate({"name": req.body.name}, {$set: {"phone": req.body.phone, "address":req.body.address}},  
    function(err,response) {
        if(err){
            res.send("Error -"+err)
        }
        else{
            res.json(response)
        }
    })
})




mongoose.connect(mongoUrl,{useNewUrlParser:true, useUnifiedTopology: true})
const con = mongoose.connection

con.on('open', function(){
    console.log("Connected to database");
})

