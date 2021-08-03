const controllers = require('../controllers/controller');

module.exports = app => {
    app
        .route('/characters')
        .get(controllers.list_all_characters)

    app
        .route('/comics')
        .get(controllers.list_all_comics)


    app
        .route('/authors')
        .get(controllers.list_all_authors)

    app
        .route('/characters/:id')
        .get(controllers.show_one_character)
        .post();


};