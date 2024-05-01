var express = require('express');
 var app = express();
 var mysql = require('mysql');
 app.set("view engine", "ejs"); // template engine
 var bodyparser = require("body-parser");
const { PhoneModule } = require('@faker-js/faker');
 app.use(bodyparser.urlencoded({ extended: true }));
 app.use(express.static("public"));
 app.set("views","views");
 
 var con = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   database: 'restaurantdb'
 });
 con.connect((err) => {
   if (err) {
     console.error('Error connecting to the database:', err);
     return;
   }
   console.log('Connected to the database');
 });
 
 // Home base menu page path
  app.get("/home", function (req, res) {
   res.render("home");
 });
 //other nav routes
 app.get("/menu",(req,res)=>{
  const q = "select * from menuitems";
  con.query(q,(err,results)=>{
      if(err) throw err;
      res.render("menu",{data: results});
  })
})
app.get("/order", function (req, res) {
  res.render("order");
});
app.get("/reservation", function (req, res) {
  res.render("reservation");
});
app.get("/aboutus", function (req, res) {
  res.render("aboutus");
});
app.get("/review",(req,res)=>{
  const q = "select * from review";
  con.query(q,(err,results)=>{
      if(err) throw err;
      res.render("review",{data: results});
  })
})

 
//insert reviews
app.get("/insertreview", function (req, res) {
  res.render("insertreview");
});
app.get("/reviewsuccess", function (req, res) {
  res.render("reviewsuccess");
});
app.get("/reviewfailure", function (req, res) {
  res.render("reviewfailure");
});

app.post("/insertreview", function(req, res) {

  if (req.body.name == "") req.body.name = "Anonymous";
  if (req.body.email == "") req.body.email = "none";
  if (req.body.rating == "") req.body.rating = "none";
  if (req.body.comments == "") req.body.comments = "No Comment";

  var info = { name: req.body.name, email: req.body.email, rating: req.body.rating, comments: req.body.comments};
  var q = "INSERT INTO review SET ?";
  var success = true;

  con.query(q, info, function(error, results) {
  if (error) throw err; 
  
  if (results.affectedRows == 0) success = false;

  console.log(results);

  if (success) res.redirect("/reviewsuccess"); // back to review page
  else res.redirect("/reviewfailure"); // redirect to error page, query failed
});
});
//order  
app.get("/insertorder", function (req, res) {
  res.render("insertorder");
});
app.get("/ordersuccess", function (req, res) {
  res.render("ordersuccess");
});
app.get("/orderfailure", function (req, res) {
  res.render("orderfailure");
});
app.get("/searchorderfailure", function (req, res) {
  res.render("searchorderfailure");
});
app.get("/searchordersuccess", function (req, res) {
  res.render("searchordersuccess");
});
//insert order
app.post("/insertorder", function(req, res) {

  if (req.body.foodItem == "") req.body.foodItem = "no food";
  if (req.body.quantity == "") req.body.quantity = "1";
  if (req.body.customerName == "") req.body.customerName = "No name";
  if (req.body.customerEmail == "") req.body.customerEmail = "No email";
  if (req.body.customerAddress == "") req.body.customerAddress = "No address";

  var info = {foodItem: req.body.foodItem, quantity: req.body.quantity, customerName: req.body.customerName, customerEmail: req.body.customerEmail, customerAddress: req.body.customerAddress};
  var q = "INSERT INTO orders SET ?";
  var success = true;

  con.query(q, info, function(error, results) {
  if (error) throw err; 
  
  if (results.affectedRows == 0) success = false;

  console.log(results);

  if (success) res.redirect("/ordersuccess"); // order success 
  else res.redirect("/orderfailure"); // redirect to error page, order failed
});
});
//search for order
app.post("/searchorder", function(req, res) {
  var CustomerEmail = req.body.searchEmail;

  var params = [CustomerEmail];

  var q = "SELECT * FROM orders WHERE CustomerEmail = ?";



  con.query(q, params, function(error, results) {
    if (error) throw err;

    if (results.length > 0) {
      // Match found
      res.render("searchordersuccess", {orderData: results}); 
    } else {
      // No match found
      
      res.redirect("/searchorderfailure"); 
    }
  });
});

//reservation
app.get("/insertreservation", function (req, res) {
  res.render("insertreservation");
});
app.get("/reservationsuccess", function (req, res) {
  res.render("reservationsuccess");
});
app.get("/reservationfailure", function (req, res) {
  res.render("reservationfailure");
});
app.get("/reservationdeletefailure", function (req, res) {
  res.render("reservationdeletefailure");
});
app.get("/reservationdeletesuccess", function (req, res) {
  res.render("reservationdeletesuccess");
});
app.get('/reservationsuccess/:id', function(req, res) {
  var reservationID = req.params.id;
  res.render('reservationsuccess.ejs', { reservationID: reservationID });
});
app.post("/insertreservation", function (req, res) {

  if (req.body.Name == "") req.body.Name = "no name";
  if (req.body.Email == "") req.body.Email = "no email";
  if (req.body.Phone == "") req.body.Phone = "No phone";
  if (req.body.PartySize == "") req.body.PartySize = "No party size";
  if (req.body.AdditionalInfo == "") req.body.AdditionalInfo = "No added info";

  var info = {Name: req.body.Name, Email: req.body.Email, Phone: req.body.Phone, PartySize: req.body.PartySize, AdditionalInfo: req.body.AdditionalInfo};
  var q = "INSERT INTO reservations SET ?";
  var success = true;

  con.query(q, info, function(error, results) {
  if (error) throw err; 
  
  if (results.affectedRows == 0) success = false;

  console.log(results);


  var reservationID = results.insertId;
    
  if (success) res.redirect("/reservationsuccess/" + reservationID); // order success 
  else res.redirect("/reservationfailure"); // redirect to error page, order failed
});
});
//delete reservation
app.post("/reservationdelete", function(req, res) {

  var info = { ReservationID: req.body.deleteReservation};
  var q = "DELETE FROM reservations WHERE ?";
  var success = true;

  con.query(q, info, function(error, results) {
  if (error) throw err; 
  
  if (results.affectedRows == 0) success = false;

  console.log(results);

  if (success) res.redirect("/reservationdeletesuccess"); // redirect to success page
  else res.redirect("/reservationdeletefailure"); // redirect to error page, query failed
});
});
//update
app.get("/updatemenu", function (req, res) {
  res.render("updatemenu");
});
app.get("/updatemenusuccess", function (req, res) {
  res.render("updatemenusuccess");
});
app.get("/updatemenufailure", function (req, res) {
  res.render("updatemenufailure");
});
app.post("/updatemenuitems", function(req, res) {

  var params = [req.body.newNamemenu, req.body.newDescmenu, req.body.newPricemenu, req.body.oldIDmenu];

  var q = "UPDATE menuitems SET Name = ?, Description = ?, Price = ? WHERE (ItemID = ?)";
  var success = true;

  console.log(params);

  con.query(q, params, function(error, results) {
  if (error) throw error; 

  if (results.affectedRows == 0) success = false;

  console.log(results);

  if (success) res.redirect("/updatemenusuccess"); // redirect to success page
  else res.redirect("/updatemenufailure"); // redirect to error page, query failed
});
});
 //////////////////////////////////////////////////////////////////////////////////////////////////////////
 app.listen(8080, function () 
 {
   console.log('App listening on port 8080!');
 });