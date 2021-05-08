const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/* ############################################ Middlewares ############################################ */
const validateRequest = require('../middlewares/ValidateRequest');
const authenticationMiddleware = require('../middlewares/AuthenticationMiddleware');

/* ############################################ Joi Validation Schema ############################################ */
const usersValidationSchema = require('../validation-schemas/UsersValidationSchemas');
const songsValidationsSchema = require('../validation-schemas/SongsValidationSchema');

/* ############################################ Controllers ############################################ */
const usersController = require('../controllers/Api/UsersController');
const commonController = require('../controllers/Common/CommonController');
const songsController = require('../controllers/Api/SongsController');
const artistAPIController = require('../controllers/Api/ArtistController');
const podcastController = require('../controllers/Api/PodcastsController');

/* ############################################ Routes  ############################################ */


// SET STORAGE FOR PROFILE PICTURE
var storageProfilePicture = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/profile_images';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var uploadProfilePicture = multer({ storage: storageProfilePicture })

// ################################### HOMEPAGE ########################################### //
router.post('/register', validateRequest.validate(usersValidationSchema.userRegisterSchema, 'body'), usersController.registerUser); // User Registration Route
router.post('/login', validateRequest.validate(usersValidationSchema.loginSchema, 'body'), usersController.userLogin); // System Login Route
router.post('/social-login', validateRequest.validate(usersValidationSchema.socialLoginSchema, 'body'), usersController.socialLogin); // System Login Route
router.post('/forgot-password', validateRequest.validate(usersValidationSchema.forgotPassSchema, 'body'), usersController.forgotPassword); // Forgot Password Route
router.post('/verify-otp', validateRequest.validate(usersValidationSchema.otpVerificationSchema, 'body'), usersController.verifyOTP); // OTP Verification Route
router.post('/reset-password', validateRequest.validate(usersValidationSchema.resetPassSchema, 'body'), usersController.resetPassword); // Reset Password Route
router.get('/fetch-user-details', authenticationMiddleware.authenticateRequestAPI, usersController.fetchUserDetails); // Fetch User Details
router.put('/update-user-details', validateRequest.validate(usersValidationSchema.updateUserDetails, 'body'), authenticationMiddleware.authenticateRequestAPI, usersController.updateUserName); // Fetch User Details
router.put('/update-user-picture', authenticationMiddleware.authenticateRequestAPI, uploadProfilePicture.single('file'), usersController.updateProfilePicture); // Fetch User Details
router.put('/update-user-country', validateRequest.validate(usersValidationSchema.updateUserCountry, 'body'), authenticationMiddleware.authenticateRequestAPI, usersController.updateUserCountry); // Fetch User Details

// ################################### COMMON ########################################### //
router.get('/countries', commonController.fetchCountries); // Fetch Countries

// ################################### HOMEPAGE ########################################### //
router.get('/homepage', authenticationMiddleware.authenticateRequestAPI, songsController.fetchHomePageData); // Fetch Home page data
router.get('/all-recently-played', validateRequest.validate(songsValidationsSchema.allRecentlyPlayed, 'query'), authenticationMiddleware.authenticateRequestAPI, songsController.allRecentlyPlayed); // See All Recently played songs
router.get('/all-recommend', validateRequest.validate(songsValidationsSchema.allRecentlyPlayed, 'query'), authenticationMiddleware.authenticateRequestAPI, songsController.allRecommend); // See All Recommend songs
router.get('/all-weekly-top', validateRequest.validate(songsValidationsSchema.allRecentlyPlayed, 'query'), authenticationMiddleware.authenticateRequestAPI, songsController.allWeeklyTop); // See All weekly top songs
router.get('/all-artist', validateRequest.validate(songsValidationsSchema.allRecentlyPlayed, 'query'), authenticationMiddleware.authenticateRequestAPI, songsController.allArtist); // See All artist
router.get('/all-free-songs', validateRequest.validate(songsValidationsSchema.allRecentlyPlayed, 'query'), authenticationMiddleware.authenticateRequestAPI, songsController.allFreeSongs); // See All Free songs

// ################################### SONGS ########################################### //
router.get('/artist-songs', validateRequest.validate(songsValidationsSchema.artistSongs, 'query'), authenticationMiddleware.authenticateRequestAPI, songsController.artistWiseTrack); // Artist wise songs
router.get('/album-songs', validateRequest.validate(songsValidationsSchema.albumSongs, 'query'), authenticationMiddleware.authenticateRequestAPI, songsController.albumWiseTrack); // Album wise songs
router.get('/artist-albums', validateRequest.validate(songsValidationsSchema.artistSongs, 'query'), authenticationMiddleware.authenticateRequestAPI, songsController.allAlbumsList); // Artist wise album list
router.post('/mark-unmark-liked/:id', authenticationMiddleware.authenticateRequestAPI, songsController.favouriteAndUnfavourite); // Mark & Unmark Favourite

// ################################### SONGS ########################################### //
router.post('/artist-follow/:id', authenticationMiddleware.authenticateRequestAPI, artistAPIController.followArtist); // Artist Follow

// ################################### Playlist ########################################### //
router.post('/create-playlist', validateRequest.validate(songsValidationsSchema.createPlaylist, 'body'), authenticationMiddleware.authenticateRequestAPI, songsController.createPlaylist); // Create Playlist
router.post('/add-song-to-playlist', validateRequest.validate(songsValidationsSchema.addSongToPlaylist, 'body'), authenticationMiddleware.authenticateRequestAPI, songsController.addSongToPlaylist); // Add Song To Playlist
router.get('/playlist-list', validateRequest.validate(songsValidationsSchema.playlistList, 'query'), authenticationMiddleware.authenticateRequestAPI, songsController.playlistList); // Playlist List
router.get('/playlist-songs', validateRequest.validate(songsValidationsSchema.playlistSongs, 'query'), authenticationMiddleware.authenticateRequestAPI, songsController.playlistSongs); // Playlist Songs

// ################################### Podcast ########################################### //
router.get('/podcast/homepage', authenticationMiddleware.authenticateRequestAPI, podcastController.podcastHomepage);

module.exports = router;