const joi = require('joi');

const validateBody = (schema) => {
    return (req, res, next) => {
        const validateResult = schema.validate(req.body);

        if (validateResult.error) {
            return res.status(400).json({
                message: validateResult.error.details[0].message,
            });
        } else {
            if (!req.value) {
                req.value = {};
            }
            if (!req.value['body']) {
                req.value['body'] = {};
            }

            req.value['body'] = validateResult.value;
            next();
        };
    };
};

const validateParams = (schema, name) => {
    return (req, res, next) => {
        const validateResult = schema.validate({ param: req.params[name] });

        if (validateResult.error) {
            return res.status(400).json({
                message: validateResult.error.details[0].message,
            });
        } else {
            if (!req.value) {
                req.value = {};
            }
            if (!req.value['params']) {
                req.value['params'] = {};
            }

            req.value['params'][name] = validateResult.value.param;
            next();
        }
    };
};

const schemas = {
    idSchema: joi.object().keys({
        param: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    userSchema: joi.object().keys({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email().required(),
    }),
    signupSchema: joi.object().keys({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    }),
    loginSchema: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    }),
};

module.exports = {
    validateBody,
    validateParams,
    schemas
};