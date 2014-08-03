exports.index = function(req, res){
  res.render('index/index', { title: 'Express :: Index' });
};

exports.about = function(req, res){
  res.render('index/about', { title: 'Express :: About' });
};

exports.contact = function(req, res){
  res.render('index/contact', { title: 'Express :: Contact' });
};

exports.dashboard = function(req, res){
  res.render('index/dashboard', { title: 'Express :: Dashboard' });
};

exports.settings = function(req, res){
  res.render('index/settings', { title: 'Express :: Settings' });
};
