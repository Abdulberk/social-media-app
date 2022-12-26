const router = require('express').Router();
const { verifyToken } = require('../controllers/authControllers');
const notController = require('../controllers/notControllers');


router.post('/post/new-category',verifyToken,notController.addCategories);
router.get('/get-all-categories',verifyToken,notController.getAllCategories);
router.get ('/get-posts-count-in-category/:id',verifyToken,notController.getPostsCountInCategory);




module.exports = router;
