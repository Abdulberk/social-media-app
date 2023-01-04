const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');


const recommendMe = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    
    const user = await User.findById(userId)
    
    const userFollowings = user.following;

    const likedPosts = user.likes;

    const likedPostsByFriend = [];

    for (let i=0; i<userFollowings.length; i++){

        let currentFriendId = userFollowings[i];

        const friend = await User.findById(currentFriendId);

        const likedPostsOfFriend  = friend.likes;

        const populateCategoryOfLikedPostsOfFriend = await likedPostsOfFriend.populate({
            path: 'category',
            select: 'name'
        })

        for (let p=0;p<=likedPostsOfFriend.length;p++){

            const currentPostId = likedPostsOfFriend[p];

            likedPostsByFriend.push(currentPostId);

        }
    }

    const recommendedPostsArray = [];
    
    const likedPostsByFriendFiltered = likedPostsByFriend.filter((post) => {
        return likedPosts.includes(post) === false;
    }
        )

        const reducedArray = likedPostsByFriendFiltered.reduce((acc, current) => {
            
        },likedPosts)

        console.log(reducedArray);


})

module.exports = recommendMe;





