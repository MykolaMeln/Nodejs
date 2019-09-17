var express= require('express');
var path=require('path');
var app=express();
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));
var config = require('./libs/config');

app.get('/api',function (req, res) {
    res.send('API is running');
});
var log = require('./libs/log')(module);
var ArticleModel = require('./libs/mongoose').ArticleModel;

app.get('/api/articles', function(req, res) {
return ArticleModel.find(function (err, articles) {
    if (!err) {
          return res.send(articles);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode,err.message);
            return res.send({ error: 'Server error' });
          }
        });
      });

app.get('/ErrorExample',function(req, res, next) {
next(new Error('Random error!'));
});

app.post('/api/articles', function(req, res) {
  console.log(req.body);
          var article = new ArticleModel({
            author: req.body.author,
            description: req.body.description,
            title: req.body.title,
            modified: req.body.modified
            //images: req.body.images
   });

article.save(function (err) {
      if (!err) {
          log.info("article created");
          return res.send({
            status: 'OK',
            article:article
          });
        } else {
          console.log(err);
          if(err.name == 'ValidationError') {
           res.statusCode = 400;
           res.send({ error: 'Validation error' });
         } else {
           res.statusCode = 500;
           res.send({ error: 'Server error' });
         }
         log.error('Internal error(%d): %s',res.statusCode,err.message);
       }
  });
});

app.get('/api/articles/:id', function(req, res) {
        return ArticleModel.findById(req.params.id, function (err, article) {
            if(!article) {
              res.statusCode = 404;
              return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', article:article });
          } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
          }
        });
});

app.put('/api/articles/:id', function (req, res) {
return ArticleModel.findById(req.params.id, function (err, article) {
        if(!article) {
          res.statusCode = 404;
          return res.send({ error: 'Not found' });
        }
        article.title = req.body.title;
        article.description = req.body.description;
        article.author = req.body.author;
        article.modified = req.body.modified;
        //article.images = req.body.images;
        return article.save(function (err) {
          if (!err) {
            log.info("article updated");
            return res.send({ status: 'OK', article:article });
          } else {
             if(err.name == 'ValidationError') {
               res.statusCode = 400;
               res.send({ error: 'Validation error' });
             } else {
               res.statusCode = 500;
               res.send({ error: 'Server error' });
             }
             log.error('Internal error(%d): %s',res.statusCode,err.message);
           }
         });
       });
     });

app.delete('/api/articles/:id', function (req, res) {
    return ArticleModel.findById(req.params.id, function (err, article) {
          if(!article) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
          }
          return article.remove(function (err) {
            if (!err) {
              log.info("article removed");
              return res.send({ status: 'OK' });
            } else {
              res.statusCode = 500;
              log.error('Internal error(%d): %s', res.statusCode,err.message);
              return res.send({ error: 'Server error' });
            }
          });
        });
      });

app.use(function (req, res, next) {
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({error:'Not found'});
    return;
});

app.use(function(err, req, res, next) {
res.status(err.status || 500);
log.error('Interal error(%d):%s',res.statusCode,err.message);
res.send({error:err.message});
return;
});

app.listen(config.get('port'), function() {
console.log('Express server listening on port ' + config.get('port'));
});
