// set the routes for navbar
exports.getHomePage = (req, res) => {
    const data = {
        title: 'We Are Proud',
        description: 'The Brandeis Students and Alumni Association is a vibrant community that offers lifelong opportunities for students and alumni to stay connected to Brandeis and each other.',
    };
  
    res.render('index', data);
}; 

exports.getAboutPage = (req, res) => {
    res.render('about');
};

exports.getContactPage = (req, res) => {
    res.render('contact');
};

exports.getEventsPage = (req, res) => {
    res.render('events');
};

exports.getJobsPage = (req, res) => {
    res.render('jobs');
};

exports.getContactPage = (req, res) => {
    res.render('contact');
};