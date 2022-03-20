const User = require('../models/User');
const Deck = require('../models/Deck');

const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const encodeJWT = (id) => {
    return JWT.sign({
        iss: 'datprs',
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, JWT_SECRET);
};

const create = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.value.body;

    const foundUser = await User.findOne({ email });
    if (foundUser) {
        return res.status(403).json({
            message: 'Email already exists'
        });
    }

    const user = new User({ firstName, lastName, email, password });
    user.save();

    const token = encodeJWT(user.id);

    res.setHeader('Authorization', token);

    return res.status(201).json({
        message: 'Tạo tài khoản thành công.',
    });
};

const index = async (req, res, next) => {
    const user = await User.find({});

    return res.status(200).json({
        user
    });
};

const getUserDecks = async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id).populate('decks');

    return res.status(200).json({
        user
    });
};

const newUserDeck = async (req, res, next) => {
    const { id } = req.params;

    const deck = await Deck.create(req.body);

    const user = await User.findById(id);

    deck.own = user._id;

    await deck.save();

    user.decks.push(deck._id);

    await user.save();

    return res.status(201).json({
        deck
    });
};

const login = async (req, res, next) => {
    const token = encodeJWT(req.user._id);
    res.setHeader('Authorization', token);
    return res.status(200).json({
        message: 'Đăng nhập thành công.',
    });
};

const secret = async (req, res, next) => {
    return res.status(200).json({
        message: 'This is a secret message'
    });
};

const show = async (req, res, next) => {
    const { id } = req.value.params;

    const user = await User.findById(id);

    return res.status(200).json({
        user
    });
};

module.exports = {
    index,
    create,
    show,
    newUserDeck,
    getUserDecks,
    login,
    secret
};