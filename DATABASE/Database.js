var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'mainPage'});
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine','handlebars');
app.set('port', 8825);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

var newTable = "CREATE TABLE IF NOT EXISTS workout(" + 
 "id INT PRIMARY KEY AUTO_INCREMENT," + 
 "name VARCHAR(255) NOT NULL," +
 "reps INT," +
 "weight INT," +
 "date DATE," + 
 "lbs BOOLEAN)";
mysql.pool.query(newTable, function(err) {
    if (err) console.log(err);
    console.log("workout table created");
});

app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workout', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('tablePage', context);
  });
});

app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO workout (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", 
  [req.query.a, req.query.b, req.query.c, req.query.d, req.query.e], function(err, result){
    if(err){
      next(err);
      return;
    }
  mysql.pool.query('SELECT * FROM workout', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.render('tablePage', context);
  });
 });
});

app.get('/delete',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM workout WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
  mysql.pool.query('SELECT * FROM workout', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;  
    res.render('tablePage',context);
  });
 });
});

app.get('/update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM workout WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE workout SET name=?, reps=?, weight=?, lbs=?, date=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.lbs || curVals.lbs, req.query.date || curVals.date, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
    mysql.pool.query('SELECT * FROM workout', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
        res.render('tablePage',context);
      });
     });
    }
  });
});

app.get('/reset',function(req,res,next){
  var context = {};
  mysql.pool.query('DROP TABLE IF EXISTS workout', function(err){
    var createString = 'CREATE TABLE workout(' +
    'id INT PRIMARY KEY AUTO_INCREMENT,' +
    'name VARCHAR(255) NOT NULL,' +
	'reps INT,' +
	'weight INT,' +
    'date DATE)' +
	'lbs BOOLEAN)';
    mysql.pool.query(createString, function(err){
	console.log('NEW TABLE');
     res.render('tablePage', context);
    })
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



