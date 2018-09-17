var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'home'});
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine','handlebars');
app.set('port', 2534);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

//This function renders the index page
app.get('/', funtion(req, res, next){
	var context = {};
	if(err){
		next(err);
		return:
	}
    res.render('index', context);
});

//This function selects all the data from the space_farmer Table
app.get('/viewFarmer',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM space_farmer," function(err, rows, fields){ 
    if(err){
      next(err);
      return;
    }
  context.results = rows;
   res.render('spaceFarmer', context);
  });
});

//This function selects all the data from the planet Table
app.get('/viewPlanet',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM planet," function(err, rows, fields){ 
    if(err){
      next(err);
      return;
    }
  context.results = rows;
   res.render('planet', context);
  });
});

//This function selects all the data from the crops Table
app.get('/viewCrops',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM crops," function(err, rows, fields){ 
    if(err){
      next(err);
      return;
    }
  context.results = rows;
   res.render('crops', context);
  });
});

//This function selects all the data from the weapon Table
app.get('/viewWeapon',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM weapon," function(err, rows, fields){ 
    if(err){
      next(err);
      return;
    }
  context.results = rows;
   res.render('weapon', context);
  });
});

//This function selects all the data from the aliens Table
app.get('/viewAliens',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM aliens," function(err, rows, fields){ 
    if(err){
      next(err);
      return;
    }
  context.results = rows;
   res.render('aliens', context);
  });
});

//This function inserts new data to the space_farmer Table
app.get('/addFamer',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO space_farmer (fname, lname, experience, homeworld, fav_weapon) VALUES (?, ?, ?, ?, ?)", 
  [req.query.a, req.query.b, req.query.c, req.query.d, req.query.e], function(err, result){
    if(err){
      next(err);
      return;
    }
  mysql.pool.query('SELECT * FROM space_farmer', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('spaceFarmer', context);
  });
 });
});

//This function inserts new data to the planet Table
app.get('/addPlanet',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO planet (name, solar_system, population, best_crop) VALUES (?, ?, ?, ?)", 
  [req.query.a, req.query.b, req.query.c, req.query.d], function(err, result){
    if(err){
      next(err);
      return;
    }
  mysql.pool.query('SELECT * FROM planet', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('planet', context);
  });
 });
});

//This function inserts new data to the crops Table
app.get('/addCrop',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO crops (name, price, quantity) VALUES (?, ?, ?)", 
  [req.query.a, req.query.b, req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
  mysql.pool.query('SELECT * FROM crops', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('crops', context);
  });
 });
});

//This function inserts new data to the weapon Table
app.get('/addWeapon',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO weapon (name, category, price) VALUES (?, ?, ?)", 
  [req.query.a, req.query.b, req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
  mysql.pool.query('SELECT * FROM weapon', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('weapon', context);
  });
 });
});

//This function inserts new data to the aliens Table
app.get('/addAlien',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO aliens (species, description, fav_food, weakness) VALUES (?, ?, ?, ?)", 
  [req.query.a, req.query.b, req.query.c, req.query.d], function(err, result){
    if(err){
      next(err);
      return;
    }
  mysql.pool.query('SELECT * FROM aliens', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('aliens', context);
  });
 });
});

//This function deletes a row from the space_farmer table
app.get('/delFamer',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM space_farmer WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
  mysql.pool.query('SELECT * FROM space_farmer', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;  
    res.render('spaceFarmer',context);
  });
 });
});

//This function updates a row from the space_farmer Table
app.get('/updateFamer',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM space_farmer WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE space_farmer SET fname=?, lname=?, experience=?, homeworld=?, fav_weapon=? WHERE id=? ",
        [req.query.fname || curVals.fname, req.query.lname || curVals.lname, req.query.experience || curVals.experience, req.query.homeworld || curVals.homeworld, req.query.fav_weapon || curVals.fav_weapon, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
    mysql.pool.query('SELECT * FROM space_farmer', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('spaceFarmer',context);
      });
     });
    }
  });
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});



