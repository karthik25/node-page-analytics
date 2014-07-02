/* GET home page. */
exports.index = function(req, res){
  res.render('index', { title: 'Express :: Index' });
};

exports.about = function(req, res){
  res.render('about', { title: 'Express :: About' });
};

exports.contact = function(req, res){
  res.render('contact', { title: 'Express :: Contact' });
};

exports.record = function(req, res){
  var seconds = req.body.seconds;
  var url = req.body.url;
  console.log('Url: ' + url + '; duration = ' + seconds);
  res.json({ result: true });
};
