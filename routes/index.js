exports.index = function(req, res){
  res.render('index', { title: 'Express :: Index' });
};

exports.about = function(req, res){
  res.render('about', { title: 'Express :: About' });
};

exports.contact = function(req, res){
  res.render('contact', { title: 'Express :: Contact' });
};

exports.dashboard = function(req, res){
  res.render('dashboard', { title: 'Express :: Dashboard' });
};

exports.settings = function(req, res){
  res.render('settings', { title: 'Express :: Settings' });
};
