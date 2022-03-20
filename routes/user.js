const router = require('express-promise-router')();

const UserController = require('../controllers/user');

const { schemas, validateParams, validateBody } = require('../helpers/routeHelpers');

const passport = require('passport');
const passportConfig = require('../middlewares/passport');


router.route('/signup').post(validateBody(schemas.signupSchema), UserController.create);
router.route('/login').post(validateBody(schemas.loginSchema), passport.authenticate('local', { session: false }), UserController.login);
router.route('/secret').get(passport.authenticate('jwt', { session: false }), UserController.secret);

router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema), UserController.create);

router.route('/:id')
    .get(validateParams(schemas.idSchema, 'id'), UserController.show)
    .post(UserController.newUserDeck);

router.route('/:id/decks')
    .get(UserController.getUserDecks)



module.exports = router;