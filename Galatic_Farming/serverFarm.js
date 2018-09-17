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
	

function getFarmer(context, id){
        var sql = ("SELECT sfid, fname, lname, experience FROM space_farmer WHERE sfid=?");
		var insert = [id];
		mysql.pool.query(sql,insert,function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.farmer  = rows[0];
        });
    }	
	
	
 function getPlanets(context){
        mysql.pool.query("SELECT pid, name, solar_system, population FROM planet", function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.planets  = rows;
        });
    }	
	
function getCrops(context){
        mysql.pool.query("SELECT cid, name, price, quantity FROM crops", function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.food  = rows;
        });
    }	
	
function getWeapons(context){
        mysql.pool.query("SELECT wid, name, category, price FROM weapon", function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.weapons  = rows;
        });
    }	
	
function getAlien(context, id){
        var sql = ("SELECT aid, species, description FROM aliens WHERE aid=?");
		var insert = [id];
		mysql.pool.query(sql,insert,function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.alien  = rows[0];
        });
    }		
	
	
//This function renders the index page
app.get('/',function(req,res){
    res.render('index');
});

//This function selects all the data from the space_farmer Table
app.get('/viewFarmers',function(req,res,next){
  var context = {};
  getPlanets(context);
  getWeapons(context);
  mysql.pool.query("SELECT sfid, fname,lname, experience, planet.name AS homeworld, weapon.name AS fav_weapon FROM space_farmer INNER JOIN planet ON homeworld=planet.pid INNER JOIN weapon ON fav_weapon=weapon.wid", function(err, rows, fields){ 
    if(err){
      next(err);
      return;
    }
	
  context.results = rows;
   res.render('spaceFarmer', context);
  });
});

//This function selects all the data from the planet Table
app.get('/viewPlanets',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT pid, name, solar_system, population FROM planet", function(err, rows, fields){ 
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
  mysql.pool.query("SELECT cid, name, price, quantity FROM crops", function(err, rows, fields){ 
    if(err){
      next(err);
      return;
    }
  context.results = rows;
   res.render('crops', context);
  });
});

//This function selects all the data from the weapon Table
app.get('/viewWeapons',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT wid, name, category, price FROM weapon", function(err, rows, fields){ 
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
  getCrops(context);
  getWeapons(context);
  mysql.pool.query("SELECT aid, species, description, crops.name AS fav_food, weapon.name AS weakness FROM aliens INNER JOIN crops ON fav_food=crops.cid INNER JOIN weapon ON weakness=weapon.wid", function(err, rows, fields){ 
    if(err){
      next(err);
      return;
    }
  context.results = rows;
   res.render('aliens', context);
  });
});

//This function inserts new data to the space_farmer Table
app.post('/addFarmer',function(req,res,next){
   var farmer = {
	   fname:req.body.fname,
	   lname:req.body.lname,
	   experience:req.body.experience,
	   homeworld:req.body.homeworld,
	   fav_weapon:req.body.fav_weapon
   };
 
  var sql = "INSERT INTO space_farmer SET ?"; 
  sql = mysql.pool.query(sql, farmer, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }else{
     res.redirect('/viewFarmers');
    }
 });
});
 
//This function inserts new data to the planet Table
app.post('/addPlanet',function(req,res,next){
   var pl = {
	   name:req.body.name,
	   solar_system:req.body.solar_system,
	   population:req.body.population
   };
 
  var sql = "INSERT INTO planet SET ?"; 
  mysql.pool.query(sql, pl, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }else{
     res.redirect('/viewPlanets');
    }
 });
});

//This function inserts new data to the crops Table
app.post('/addCrop',function(req,res,next){
   var food = {
	   name:req.body.name,
	   price:req.body.price,
	   quantity:req.body.quantity
   };
 
  var sql = "INSERT INTO crops SET ?"; 
  mysql.pool.query(sql, food, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }else{
     res.redirect('/viewCrops');
    }
 });
});

//This function inserts new data to the weapon Table
app.post('/addWeapon',function(req,res,next){
   var weap = {
	   name:req.body.name,
	   category:req.body.category,
	   price:req.body.price
   };
 
  var sql = "INSERT INTO weapon SET ?"; 
  mysql.pool.query(sql, weap, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }else{
     res.redirect('/viewWeapons');
    }
 });
});

//This function inserts new data to the aliens Table
app.post('/addAlien',function(req,res,next){
   var creature = {
	   species:req.body.species,
	   description:req.body.description,
	   fav_food:req.body.fav_food,
	   weakness:req.body.weakness
   };
 
  var sql = "INSERT INTO aliens SET ?"; 
  mysql.pool.query(sql, creature, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }else{
     res.redirect('/viewAliens');
    }
 });
});

//This function deletes a row from the space_farmer table
app.get('/delFarmer',function(req,res,next){
	
  var str = "DELETE FROM space_farmer WHERE sfid=?";
  var inserts = [req.query.sfid];
  
  mysql.pool.query(str, inserts, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }else{
		res.redirect('/viewFarmers');
	}
 });
});

//This function deletes a row from the planet table
app.get('/delPlanet',function(req,res,next){
 
  var str = "DELETE FROM planet WHERE pid=?";
  var inserts = [req.query.pid];
  
  mysql.pool.query(str, inserts, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }else{
		res.redirect('/viewPlanets');
	}
 });
});

//This function deletes a row from the crops table
app.get('/delCrop',function(req,res,next){
   var str = "DELETE FROM crops WHERE cid=?";
  var inserts = [req.query.cid];
  
  mysql.pool.query(str, inserts, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }else{
		res.redirect('/viewCrops');
	}
 });
});

//This function deletes a row from the weapon table
app.get('/delWeapon',function(req,res,next){
  var str = "DELETE FROM weapon WHERE wid=?";
  var inserts = [req.query.wid];
  
  mysql.pool.query(str, inserts, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }else{
		res.redirect('/viewWeapons');
	}
 });
});

//This function deletes a row from the aliens table
app.get('/delAlien',function(req,res,next){
   var str = "DELETE FROM aliens WHERE aid=?";
  var inserts = [req.query.aid];
  
  mysql.pool.query(str, inserts, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }else{
		res.redirect('/viewAliens');
	}
 });
});

app.get('/updateFarmer/:id', function(req, res, next){
	var context = {};
	getFarmer(context, req.params.id);
	getPlanets(context);
	getWeapons(context);
	mysql.pool.query("SELECT * FROM space_farmer WHERE sfid=?", [req.params.id], function(err, rows, fields) {
		if(err){
			next(err);
			return;
		}
		var list = [];
         for(var row in rows){
           var toPush = {'fname': rows[row].fname, 
                          'lname': rows[row].lname, 
                          'experience': rows[row].experience, 
                          'homeworld':rows[row].homeworld, 
		                  'fav_weapon':rows[row].fav_weapon
						}
		 list.push(toPush);
		}
    context.results = list[0];
	res.render('editFarmer', context);
	});
});	

//This function updates a row from the space_farmer Table
app.put('/:id',function(req,res,next){
	   var sql = "UPDATE space_farmer SET ? WHERE sfid=?"; 
       var insert = [req.body.fname, req.body.lname, req.body.experience, req.body.homeworld, req.body.fav_weapon, req.params.id];
       
       mysql.pool.query(sql, insert, function(err,rows, fields){	   
        if(err){
          next(err);
          return;
        }else{
		res.redirect('/viewFarmers');
		}
    });
  });

//This function updates a row from the planet Table
app.get('/updatePlanet/:id',function(req,res,next){
 var context = {};
  getPlanets(context);
	mysql.pool.query("SELECT * FROM planet WHERE pid=?", [req.params.id], function(err, rows, fields) {
		if(err){
			next(err);
			return;
		}
		var list = [];
         for(var row in rows){
           var toPush = {'name': rows[row].name, 
                          'solar_system': rows[row].solar_system, 
		                  'population':rows[row].population
						}
		 list.push(toPush);
		}
    context.results = list[0];
	res.render('editPlanet', context);
	});
});

app.put('/:id',function(req,res,next){
	   var sql = "UPDATE planet SET ? WHERE pid=?"; 
       var insert = [req.body.name, req.body.solar_system, req.body.population, req.params.id];
       
       mysql.pool.query(sql, insert, function(err,rows, fields){	   
        if(err){
          next(err);
          return;
        }else{
		res.redirect('/viewPlanets');
		}
    });
  });

//This function updates a row from the crops Table
app.get('/updateCrop/:id',function(req,res,next){
  var context = {};
  getCrops(context);
	mysql.pool.query("SELECT * FROM crops WHERE cid=?", [req.params.id], function(err, rows, fields) {
		if(err){
			next(err);
			return;
		}
		var list = [];
         for(var row in rows){
           var toPush = {'name': rows[row].name, 
                          'price': rows[row].price, 
		                  'quantity':rows[row].quantity
						}
		 list.push(toPush);
		}
    context.results = list[0];
	res.render('editCrop', context);
	});
});

app.put('/:id',function(req,res,next){
	   var sql = "UPDATE crops SET ? WHERE cid=?"; 
       var insert = [req.body.name, req.body.price, req.body.quantity, req.params.id];
       
       mysql.pool.query(sql, insert, function(err,rows, fields){	   
        if(err){
          next(err);
          return;
        }else{
		res.redirect('/viewCrops');
		}
    });
  });

//This function updates a row from the weapon Table
app.get('/updateWeapon/:id',function(req,res,next){
var context = {};
   getWeapons(context);
	mysql.pool.query("SELECT * FROM weapon WHERE wid=?", [req.params.id], function(err, rows, fields) {
		if(err){
			next(err);
			return;
		}
		var list = [];
         for(var row in rows){
           var toPush = {'name': rows[row].name, 
                          'category': rows[row].category, 
		                  'price':rows[row].price
						}
		 list.push(toPush);
		}
    context.results = list[0];
	res.render('editWeapon', context);
	});
});

app.put('/:id',function(req,res,next){
	   var sql = "UPDATE weapon SET ? WHERE wid=?"; 
       var insert = [req.body.name, req.body.category, req.body.price, req.params.id];
       
       mysql.pool.query(sql, insert, function(err,rows, fields){	   
        if(err){
          next(err);
          return;
        }else{
		res.redirect('/viewWeapons');
		}
    });
  });


//This function updates a row from the aliens Table
app.get('/updateAlien/:id',function(req,res,next){
  var context = {};
	getAlien(context, req.params.id);
	getCrops(context);
	getWeapons(context);
	mysql.pool.query("SELECT * FROM aliens WHERE aid=?", [req.params.id], function(err, rows, fields) {
		if(err){
			next(err);
			return;
		}
		var list = [];
         for(var row in rows){
           var toPush = {'species': rows[row].species, 
                          'description': rows[row].description, 
                          'fav_food': rows[row].fav_food, 
		                  'weakness':rows[row].weakness
						}
		 list.push(toPush);
		}
    context.results = list[0];
	res.render('editAlien', context);
	});
});

app.put('/:id',function(req,res,next){
	   var sql = "UPDATE aliens SET ? WHERE aid=?"; 
       var insert = [req.body.species, req.body.description, req.body.fav_food, req.body.weakness, req.params.id];
       
       mysql.pool.query(sql, insert, function(err,rows, fields){	   
        if(err){
          next(err);
          return;
        }else{
		res.redirect('/viewAliens');
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



