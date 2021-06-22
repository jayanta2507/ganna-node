const express = require('express');
const router = express.Router();

/* ############################################ Middlewares ############################################ */
const validateRequest = require('../middlewares/ValidateRequest');
const authenticationMiddleware = require('../middlewares/AuthenticationMiddleware');

/* ############################################ Joi Validation Schema ############################################ */
const adminValidationSchema = require('../validation-schemas/AdminValidationSchema');

/* ############################################ Controllers ############################################ */
const adminController = require('../controllers/Admin/AdminController');

/* ############################################ Routes  ############################################ */

router.post('/login', validateRequest.validate(adminValidationSchema.loginSchema, 'body'), adminController.adminLogin); // System Login Route
router.post('/country-add', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminValidationSchema.addCountrySchema, 'body'), adminController.addCountry); // Add Country
router.get('/country-list', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminValidationSchema.listCountrySchema, 'query'), adminController.listCountry); // List Country
router.put('/country-status-change/:id', authenticationMiddleware.authenticateAdminRequestAPI, adminController.statusChangeCountry); // Country Status Change
router.post('/genre-add', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminValidationSchema.addGenreSchema, 'body'), adminController.addGenre); // Add Genre
router.get('/genre-list', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminValidationSchema.listCountrySchema, 'query'), adminController.listGenre); // List Genre
router.delete('/delete-genre/:id', authenticationMiddleware.authenticateAdminRequestAPI, adminController.deleteGenre); // Delete Genre
router.get('/artist-list', authenticationMiddleware.authenticateArtistRequestAPI, validateRequest.validate(adminValidationSchema.listCountrySchema, 'query'), adminController.listArtists); // List Artists
router.get('/artist-details/:id', authenticationMiddleware.authenticateAdminRequestAPI, adminController.artistDetails); // Artists Details
router.put('/artist-verify/:id', authenticationMiddleware.authenticateAdminRequestAPI, adminController.verifyArtist); // Artists verify
router.put('/accept-artist/:id', authenticationMiddleware.authenticateAdminRequestAPI, adminController.acceptArtist); // Accept verify
router.put('/decline-artist/:id', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminValidationSchema.declineArtistSchema, 'body'),adminController.declineArtist); // Decline Artist
router.post('/podcast-category-add', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminValidationSchema.addPodcastCategorySchema, 'body'), adminController.addPodcastCategory); // Add Podcast Category
router.get('/podcast-category-list', authenticationMiddleware.authenticateAdminRequestAPI, validateRequest.validate(adminValidationSchema.listPodcastcategorySchema, 'query'), adminController.listPodcastCategory); // List Podcast Category
router.delete('/delete-podcast-category/:id', authenticationMiddleware.authenticateAdminRequestAPI, adminController.deletePodcastCategory); // Delete Podcast Category

module.exports = router;