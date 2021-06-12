const JoiBase = require('joi');
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate); // extend Joi with Joi Date

// User Register Schema
module.exports.userRegisterSchema = Joi.object().keys({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile_no: Joi.number().required().min(7).label('Mobile No'),
    password: Joi.string().required().min(6),
    confirm_password: Joi.string().equal(Joi.ref('password')).required().messages({
        'any.only': `Confirm Password should match with Password`,
    }), //Confirm password must be same as password
    dob: Joi.date().required().format("YYYY-MM-DD"),
    country_id: Joi.number().required()
});

// Login Schema
module.exports.loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
});

// Social Login Schema
module.exports.socialLoginSchema = Joi.object().keys({
    full_name: Joi.string().required(),
    email: Joi.string().required(),
    mobile_no: Joi.number().allow(null, ''),
    password: Joi.string().required(),
    dob: Joi.date().format("YYYY-MM-DD").allow(null, ''),
    profile_image: Joi.string().allow(null, ''),
    login_type: Joi.string().valid('facebook', 'google').required()
});

// Forgot Password Schema
module.exports.forgotPassSchema = Joi.object().keys({
    email: Joi.string().required(),
});

// OTP Verification Schema
module.exports.otpVerificationSchema = Joi.object().keys({
    otp: Joi.string().required(),
    email: Joi.string().email().required()
});

// Reset Password Schema
module.exports.resetPassSchema = Joi.object().keys({
    password: Joi.string().required().min(6),
    confirm_password: Joi.string().equal(Joi.ref('password')).required().messages({
        'any.only': `Confirm Password should match with Password`,
    }), //Confirm password must be same as password
    otp: Joi.string().required()
});

// Artist Details Step One Schema
module.exports.artistDetailsStepOne = Joi.object().keys({
    street: Joi.string().required(),
    building_no: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required()
});

// Artist Details Step Two Schema
module.exports.artistDetailsStepTwo = Joi.object().keys({
    account_holder_name: Joi.string().required(),
    account_number: Joi.string().required(),
    routing_no: Joi.string().required(),
    branch_address: Joi.string().required(),
    branch_name: Joi.string().required(),
    bank_country: Joi.number().required(),
    bank_state: Joi.string().required(),
    bank_city: Joi.string().required(),
    bank_zip: Joi.string().required(),
    currency: Joi.string().required(),
    swift_code: Joi.string().required(),
});

// Artist Details Step Three Schema
module.exports.artistDetailsStepThree = Joi.object().keys({
    govt_id_front: Joi.string().required(),
    govt_id_back: Joi.string().required(),
});

// Artist Details Step Four Schema
module.exports.artistDetailsStepFour = Joi.object().keys({
    sample_song_name: Joi.string().required(),
    sample_song_path: Joi.string().required(),
    sample_song_type: Joi.number().required(),
    sample_song_description: Joi.string().required().allow('', null),
});

// Album Create Schema
module.exports.createAlbum = Joi.object().keys({
    name: Joi.string().required(),
    album_category_id: Joi.string().required(),
});

// List Albums Schema
module.exports.listAlbums = Joi.object().keys({
    page: Joi.number().min(1).required(),
    search: Joi.string().required().allow('', null),
    sortKey: Joi.string().required().allow('', null),
    sortType: Joi.string().required().allow('', null),
});

// List Albums Schema
module.exports.createSong = Joi.object().keys({
    name: Joi.string().required(),
    cover_picture: Joi.string().required(),
    length: Joi.string().required(),
    file_name: Joi.string().required(),
    details: Joi.string().required(),
    album_id: Joi.number().optional(),
    is_paid: Joi.number().valid(0,1).required(),
    genre_id: Joi.number().optional(),
    price: Joi.number().optional(),
    song_category_id: Joi.string().required(),
});

// List Albums Schema
module.exports.songList = Joi.object().keys({
    page: Joi.number().min(1).required(),
    search: Joi.string().required().allow('', null),
});

module.exports.createPodcast = Joi.object().keys({
    name: Joi.string().required(),
    cover_picture: Joi.string().required(),
    length: Joi.string().required(),
    file_name: Joi.string().required(),
    details: Joi.string().required(),
    is_paid: Joi.number().valid(0,1).required(),
    category_id: Joi.number().required(),
    price: Joi.number().optional(),
});

// List Albums Schema
module.exports.podcastsList = Joi.object().keys({
    page: Joi.number().min(1).required(),
    search: Joi.string().required().allow('', null),
});


// Add Podcast Category Schema
module.exports.addPodcastCategorySchema = Joi.object().keys({
    name: Joi.string().required(),
    details: Joi.string().required(),
    cover_picture: Joi.string().required()
});
// List Podcast Category Schema
module.exports.listPodcastcategorySchema = Joi.object().keys({
    page: Joi.number().min(1).required(),
    search: Joi.string().required().allow('', null),
});

// Add Album Category Schema
module.exports.addAlbumCategorySchema = Joi.object().keys({
    name: Joi.string().required(),
    details: Joi.string().required(),
    cover_picture: Joi.string().required()
});
// List Album Category Schema
module.exports.listAlbumcategorySchema = Joi.object().keys({
    page: Joi.number().min(1).required(),
    search: Joi.string().required().allow('', null),
});

// Add Song Category Schema
module.exports.addSongCategorySchema = Joi.object().keys({
    name: Joi.string().required(),
    details: Joi.string().required(),
    cover_picture: Joi.string().required()
});
// List Song Category Schema
module.exports.listSongcategorySchema = Joi.object().keys({
    page: Joi.number().min(1).required(),
    search: Joi.string().required().allow('', null),
});

// Add Song Category Schema
module.exports.updateCategorySchema = Joi.object().keys({
    name: Joi.string().required(),
    details: Joi.string().required(),
    cover_picture: Joi.string().required().allow('', null),
});

// Update Profile Schema
module.exports.updateProfileSchema = Joi.object().keys({
    full_name: Joi.string().required(),
    mobile_no: Joi.number().optional().min(7).allow(null, '').label('Mobile No'),
    dob: Joi.date().required().format("YYYY-MM-DD"),
    country_id: Joi.number().required(),
    profile_image: Joi.string().optional().allow('', null)
});

