// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid=require('shortid'); 
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({books:[]})
  .write()

app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get('/',function(req,res){
  res.send('Welcome to my library hihi');
})
app.get('/books',function(req,res){
  res.render('library.pug',{
    meow:db.get('books').value()
  });
})
app.get('/create',function(req,res){
  res.render('create.pug');
})
app.get('/books/:id/delete',function(request,response){
  var id=request.params.id;
  console.log(request.params)
  db.get('books')
  .remove({ id:id })
  .write()
  response.redirect('/books');
})
app.get('/books/:id/update',function(request,response){
  response.render('update.pug',{
    meow:request.params.id
  });
  
})
app.post('/books/:id/update',function(req,res){
  var tit=req.params.title;
 // var des=req.params.title;
  var id=req.params.id;
//  console.log(tit);
//  console.log(req.body.title);
//  console.log(req.params);
  db.get('books')
  .find({ id: id })
  .assign({ title: req.body.title})
  .write()
  res.redirect('/books');
})
app.post('/create',function(req,res){
  req.body.id=shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books'); 
})
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
