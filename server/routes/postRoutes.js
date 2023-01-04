const router = require('express').Router();
const { verifyToken } = require('../controllers/authControllers');
const notController = require('../controllers/notControllers');
const recommendMe = require('../utils/recommend');

router.get('/allposts',verifyToken,notController.getAllPosts)
router.get('/myposts',verifyToken,notController.getMyPosts)
router.get('/posts/:id',verifyToken,notController.getOnePost);
router.post('/post',verifyToken,notController.addPost);
router.delete('/posts/:id',verifyToken,notController.deletePost);
router.put('/posts/:id',verifyToken,notController.updatePost);
router.get('/search',notController.getSearchResults);
router.post('/posts/:id/like',verifyToken,notController.likePost);
router.get('/showlikes', verifyToken, recommendMe);





module.exports = router;

