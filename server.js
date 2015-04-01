#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var app = require('express')();
var mysql = require('mysql');
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var pool  = mysql.createPool({
  host     : process.env.OPENSHIFT_MYSQL_DB_HOST||'127.0.0.1',
  user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME||'root',
  password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD||'root',
  port     : process.env.OPENSHIFT_MYSQL_DB_PORT||3306,
  database : 'april'
});

app.configure(function(){
  // Allow Cors
  app.set('view engine', 'ejs');
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  // Add bodyparser for post data
  app.use(express.bodyParser());
  app.use(app.router);
});
app.get("/news/:id",function(req,res){
  pool.getConnection(function(err, connection) {
    if(err){
      console.log(err);
      res.status(503).send("Database Error");
    }else{
      connection.query("UPDATE `news` SET view=view+1 WHERE id = '"+req.params.id+"'",function(err,rows){
        connection.query("SELECT * FROM news WHERE id = '"+req.params.id+"'",function(err,rows){
          connection.release();
          if(err){
            res.status(503).send("Database query crash");
          }else{
            if(rows.length>0){
              delete rows[0].addtime;
              delete rows[0].ip;
              if(rows[0].isDelete==1){
                res.render('404',{});
              }else{
                delete rows[0].isDelete;
                res.render('news',rows[0]);
              }
            }else{
              var output = {};
              res.render('404',{});
            }
          }
        });
      });
    }
  });
});
app.post("/add",function(req,res){
  if(req.body.title&&req.body.description&&req.body.image){
    req.body.title = sqlEscape(req.body.title);
    req.body.description = sqlEscape(req.body.description);
    req.body.image = sqlEscape(req.body.image);
    pool.getConnection(function(err, connection) {
      if(err){
        console.log(err);
        res.status(503).send("Database Error");
      }else{
        connection.query("INSERT INTO `news`(`title`, `description`, `image`, `ip`) VALUES ('"+req.body.title+"','"+req.body.description+"','"+req.body.image+"','"+getUserIP(req)+"')",function(err,rows){
          if(err){
            res.status(503).send(err);
          }
          connection.query("SELECT * FROM news WHERE title='"+req.body.title+"'AND description='"+req.body.description+"'AND image='"+req.body.image+"' AND ip='"+getUserIP(req)+"'",function(err,rows){
            connection.release();
            if(err){
              res.status(503).send("Database Error");
            }else{
              if(rows.length==0){
                  res.stauts(503).send("Database Empty select");
              }else{
                var output = {};
                output.id = rows[0].id;
                res.status(200).send(output);
              }
            }
          });
        });
      }
    });
  }
});

app.get("/",function(req,res){
  res.render('index',{});
});

app.get("*",function(req,res){
  res.render('404',{});
});

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port);
});

function getUserIP(req){
  if(!req.headers['cf-connecting-ip']){
    return req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
   }else{
     return req.headers['cf-connecting-ip'];
   }
}

function sqlEscape(val) {
  val = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
    switch (s) {
      case "\0":
        return "\\0";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\b":
        return "\\b";
      case "\t":
        return "\\t";
      case "\x1a":
        return "\\Z";
      case "'":
        return "''";
      case '"':
        return '""';
      default:
        return "\\" + s;
    }
  });
  return val;
};
