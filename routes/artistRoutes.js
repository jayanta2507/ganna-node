const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/* ############################################ Middlewares ############################################ */
const validateRequest = require('../middlewares/ValidateRequest');
const authenticationMiddleware = require('../middlewares/AuthenticationMiddleware');

/* ############################################ Joi Validation Schema ############################################ */
const artistValidationSchema = require('../validation-schemas/ArtistValidationSchema');

/* ############################################ Controllers ############################################ */
const artistController = require('../controllers/Artist/ArtistController');
const commonController = require('../controllers/Common/CommonController');

/* ############################################ Routes  ############################################ */


// SET STORAGE FOR PROFILE PICTURE
var storagePicture = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/profile_images';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR GOVT ID FRONT
var storagePictureGovtIDFront = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/govt_ids';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '_front' + path.extname(file.originalname))
    }
})

// SET STORAGE FOR GOVT ID BACK
var storagePictureGovtIDBack = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/govt_ids';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '_back' + path.extname(file.originalname))
    }
})

// SET STORAGE FOR ARTIST COVER
var storagePictureAlbumCover = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/album_covers';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '_cover' + path.extname(file.originalname))
    }
})

// SET STORAGE FOR SAMPLE SONG
var storageSampleSong = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/songs/sample';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, 'sample_' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR SONG
var storageSong = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/songs';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, 'song_' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR SONG COVER IMAGE
var storageSongCover = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/songs_cover';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, 'song_cover_' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR PODCAST
var storagePodcast = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/podcasts';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, 'podcast_' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR PODCAST COVER IMAGE
var storagePodcastCover = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/podcasts_cover';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, 'podcast_cover_' + Date.now() + path.extname(file.originalname))
    }
})


// SET STORAGE FOR ALBUM CATEGORY COVER IMAGE
var storageAlbumCategoryCover = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/album_category_cover';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, 'album_category_cover_' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR SONG CATEGORY COVER IMAGE
var storageSongCategoryCover = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/song_category_cover';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, 'song_category_cover_' + Date.now() + path.extname(file.originalname))
    }
})

// SET STORAGE FOR PODCAST CATEGORY COVER IMAGE
var storagePodcastCategoryCover = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = 'uploads/podcast_category_cover';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, 'podcast_category_cover_' + Date.now() + path.extname(file.originalname))
    }
})



var uploadProfilePicture = multer({ storage: storagePicture });
var uploadGovtIDFront = multer({ storage: storagePictureGovtIDFront });
var uploadGovtIDBack = multer({ storage: storagePictureGovtIDBack });
var uploadSampleSong = multer({ storage: storageSampleSong });
var uploadAlbumCover = multer({ storage: storagePictureAlbumCover });
var uploadSong = multer({ storage: storageSong });
var uploadSongCover = multer({ storage: storageSongCover });
var uploadPodcast = multer({ storage: storagePodcast });
var uploadPodcastCover = multer({ storage: storagePodcastCover });

var uploadAlbumCategoruCover = multer({ storage: storageAlbumCategoryCover });
var uploadSongCategoruCover = multer({ storage: storageSongCategoryCover });
var uploadPodcastCategoruCover = multer({ storage: storagePodcastCategoryCover });

router.post('/register', validateRequest.validate(artistValidationSchema.userRegisterSchema, 'body'), artistController.registerArtist); // User Registration Route
router.post('/login', validateRequest.validate(artistValidationSchema.loginSchema, 'body'), artistController.artistLogin); // System Login Route
router.post('/social-login', validateRequest.validate(artistValidationSchema.socialLoginSchema, 'body'), artistController.socialLogin); // System Login Route
router.post('/forgot-password', validateRequest.validate(artistValidationSchema.forgotPassSchema, 'body'), artistController.forgotPassword); // Forgot Password Route
router.post('/verify-otp', validateRequest.validate(artistValidationSchema.otpVerificationSchema, 'body'), artistController.verifyOTP); // OTP Verification Route
router.post('/reset-password', validateRequest.validate(artistValidationSchema.resetPassSchema, 'body'), artistController.resetPassword); // Reset Password Route
router.get('/countries', commonController.fetchCountries); // Fetch Countries
router.get('/active-countries', commonController.fetchActiveCountries); // Fetch Active Countries
router.post('/artist-details/upload-profile-picture', authenticationMiddleware.authenticateArtistRequestAPI, uploadProfilePicture.single('file'), artistController.uploadArtistProfilePicture); // Upload Artist Profile Picture
router.post('/artist-details/upload-govt-id-front', authenticationMiddleware.authenticateArtistRequestAPI, uploadGovtIDFront.single('file'), artistController.uploadArtistGovtIDFront); // Upload Artist Govt ID Front
router.post('/artist-details/upload-govt-id-back', authenticationMiddleware.authenticateArtistRequestAPI, uploadGovtIDBack.single('file'), artistController.uploadArtistGovtIDBack); // Upload Artist Govt ID Back
router.post('/artist-details/upload-sample-song', authenticationMiddleware.authenticateArtistRequestAPI, uploadSampleSong.single('file'), artistController.uploadSampleSong); // Upload Artist Sample Song
router.post('/artist-details/step-one', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.artistDetailsStepOne, 'body'), artistController.saveArtistDetailsStepOne) // Save Artist Details Step One
router.post('/artist-details/step-two', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.artistDetailsStepTwo, 'body'), artistController.saveArtistDeatislStepTwo) // Save Artist Details Step Two
router.post('/artist-details/step-three', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.artistDetailsStepThree, 'body'), artistController.saveArtistDeatislStepThree) // Save Artist Details Step Three
router.post('/artist-details/step-four', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.artistDetailsStepFour, 'body'), artistController.saveArtistDeatislStepFour) // Save Artist Details Step Four
router.get('/artist-details', authenticationMiddleware.authenticateArtistRequestAPI, artistController.fetchArtistDetails); // Fetch Artist Details
router.get('/common-details', authenticationMiddleware.authenticateArtistRequestAPI, artistController.fetchCommonDetails); // Fetch Common Details
router.post('/create-album', authenticationMiddleware.authenticateArtistRequestAPI, uploadAlbumCover.single('file'), validateRequest.validate(artistValidationSchema.createAlbum, 'body'), artistController.createAlbum); // Create Album
router.put('/update-album/:id', authenticationMiddleware.authenticateArtistRequestAPI, uploadAlbumCover.single('file'), validateRequest.validate(artistValidationSchema.createAlbum, 'body'), artistController.updateAlbum); // Update Album
router.get('/album-details/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.albumDetails); // Album Details
router.delete('/album-delete/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.albumDelete); // Album Details
router.get('/album-list', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.listAlbums, 'query'), artistController.alubumsList); // Album List
router.post('/upload-song', authenticationMiddleware.authenticateArtistRequestAPI, uploadSong.single('file'), artistController.uploadSong); // Upload Song
router.post('/upload-song-cover-image', authenticationMiddleware.authenticateArtistRequestAPI, uploadSongCover.single('file'), artistController.uploadSongCover); // Upload Song Cover Image
router.post('/create-song', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.createSong, 'body'), artistController.createNewSong) // Create New Song
router.put('/update-song/:id', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.createSong, 'body'), artistController.updateSong) // Update Song
router.get('/song-details/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.songDetails) // Song Details
router.delete('/song-delete/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.songDelete) // Song Delete
router.get('/song-list', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.songList, 'query'), artistController.songList) // Song List
router.post('/upload-podcast', authenticationMiddleware.authenticateArtistRequestAPI, uploadPodcast.single('file'), artistController.uploadPodcast); // Upload Podcast
router.post('/upload-podcast-cover-image', authenticationMiddleware.authenticateArtistRequestAPI, uploadPodcastCover.single('file'), artistController.uploadPodcastCover); // Upload Podcast Cover Image
router.post('/create-podcast', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.createPodcast, 'body'), artistController.createNewPodcast) // Create New Podcast
router.get('/podcast-details/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.podcastDetails) // Podcast Details
router.get('/podcasts-list', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.podcastsList, 'query'), artistController.podcastList) // Podcast List
router.put('/update-podcast/:id', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.createPodcast, 'body'), artistController.updatePodcast) // Update Podcast
router.delete('/delete-podcast/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.deletePodcast) // Delete Podcast


router.post('/podcast-category-add', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.addPodcastCategorySchema, 'body'), artistController.addPodcastCategory); // Add Podcast Category
router.get('/podcast-category-list', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.listPodcastcategorySchema, 'query'), artistController.listPodcastCategory); // List Podcast Category
router.delete('/delete-podcast-category/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.deletePodcastCategory); // Delete Podcast Category
router.post('/upload-podcast-category-cover-image', authenticationMiddleware.authenticateArtistRequestAPI, uploadPodcastCategoruCover.single('file'), artistController.uploadPodcastCategoryCover); // Upload Podcast Category Cover Image
router.get('/podcast-category-details/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.podcastCategoryDetails) // Podcast Category Details
router.put('/update-podcast-category/:id', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.addPodcastCategorySchema, 'body'), artistController.updatePodcastCategory) // Update Podcast Category

router.post('/album-category-add', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.addAlbumCategorySchema, 'body'), artistController.addAlbumCategory); // Add Album Category
router.get('/album-category-list', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.listAlbumcategorySchema, 'query'), artistController.listAlbumCategory); // List Album Category
router.delete('/delete-album-category/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.deleteAlbumCategory); // Delete Album Category
router.post('/upload-album-category-cover-image', authenticationMiddleware.authenticateArtistRequestAPI, uploadAlbumCategoruCover.single('file'), artistController.uploadAlbumCategoryCover); // Upload Album Category Cover Image
router.get('/album-category-details/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.albumCategoryDetails) // Album Category Details
router.put('/update-album-category/:id', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.addAlbumCategorySchema, 'body'), artistController.updateAlbumCategory) // Update Album Category

router.post('/song-category-add', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.addSongCategorySchema, 'body'), artistController.addSongCategory); // Add Song Category
router.get('/song-category-list', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.listSongcategorySchema, 'query'), artistController.listSongCategory); // List Song Category
router.delete('/delete-song-category/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.deleteSongCategory); // Delete Song Category
router.post('/upload-song-category-cover-image', authenticationMiddleware.authenticateArtistRequestAPI, uploadSongCategoruCover.single('file'), artistController.uploadSongCategoryCover); // Upload Song Category Cover Image
router.get('/song-category-details/:id', authenticationMiddleware.authenticateArtistRequestAPI, artistController.songCategoryDetails) // Song category Details
router.put('/update-song-category/:id', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(artistValidationSchema.addSongCategorySchema, 'body'), artistController.updateSongCategory) // Update Song Category

module.exports = router; 









