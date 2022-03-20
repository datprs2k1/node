const passport = require('passport');
const JwtStraegy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStraegy = require('passport-local');
const { JWT_SECRET } = require('../config/index');
const User = require('../models/User');

passport.use(new JwtStraegy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);

        if (!user) {
            return done(null, false);
        } else {
            done(null, user);
        }
    } catch (error) {
        done(error, false);
    }
}
));

passport.use(new LocalStraegy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false);
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        done(error, false);
    }
}));
