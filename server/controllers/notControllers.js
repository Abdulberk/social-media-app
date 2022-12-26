const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const User = require("../models/User");
const joi = require("joi");
const Category = require("../models/Category");
const mongoose = require("mongoose");

const postSchema = joi.object({
  title: joi.string().required().min(4).max(255),
  description: joi.string().required().min(4).max(1024),
  category: joi.string().required().min(4).max(255),
 
});

const categorySchema = joi.object({
  categoryName: joi.string().required().min(4).max(255),
});

const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized" });
    } else {
      await post.remove();
      return res.status(200).json({ message: "Post deleted" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getAllPosts = asyncHandler(async (req, res) => {
  let isAdmin = req.user.isAdmin;

  if (isAdmin) {
    const getAllPosts = await Post.find({});
    return res.status(200).json(getAllPosts);
  }

  return res.status(403).json({ message: "You are not authorized" });
});

const getSearchResults = asyncHandler(async (req, res) => {
  const searchQuery = req.query.searchquery;

  const maxResults = parseInt(req.query.maxresults);

  const getResults = await Post.find({
    $or: [
      {
        title: { $regex: new RegExp(searchQuery, "i") },

        description: { $regex: new RegExp(searchQuery, "i") },
      },
    ],
  }).limit(maxResults);

  if (!getResults) return res.status(404).json({ message: "No results found" });

  return res.status(200).json(getResults);
});

const getMyPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const sort = req.query.sort || "newest";
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const getMyPosts = await Post.find({ user: userId })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ user: userId });

    const totalPages = Math.ceil(totalPosts / limit);

    if (!getMyPosts) return res.status(404).json({ message: "No posts found" });

    switch (sort) {
      case "newest":
        getMyPosts.sort((a, b) => b.createdAt - a.createdAt);
        break;

      case "oldest":
        getMyPosts.sort((a, b) => a.createdAt - b.createdAt);
        break;

      case "mostviewed":
        getMyPosts.sort((a, b) => b.views - a.views);
        break;

      case "leastviewed":
        getMyPosts.sort((a, b) => a.views - b.views);
        break;

      case "mostliked":
        getMyPosts.sort((a, b) => b.likes.length - a.likes.length);
        break;

      case "leastliked":
        getMyPosts.sort((a, b) => a.likes.length - b.likes.length);
        break;

      case "mostcommented":
        getMyPosts.sort((a, b) => b.comments.length - a.comments.length);
        break;

      case "leastcommented":
        getMyPosts.sort((a, b) => a.comments.length - b.comments.length);
        break;

      default:
        getMyPosts.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return res.status(200).json({
      posts: getMyPosts,
      page: page,
      limit: limit,
      sort: sort,
      totalPages: totalPages,
      totalCount: totalPosts,
      skip: skip,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getOnePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const getOnePost = await Post.findById(postId);

  if (!getOnePost) return res.status(404).json({ message: "No post found!" });

  return res.status(200).json(getOnePost);
});

const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { title, description } = req.body;

  const { error } = await postSchema.validateAsync(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found!" });

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found!" });

    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post!" });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, {
      title: title,
      description: description,
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const getAllCategories = await Category.find({ user: userId });

  if (!getAllCategories)
    return res.status(404).json({ message: "No categories found" });

  return res.status(200).json(getAllCategories);
});

const checkCategoryExists = (userId, categoryName) => {
  return new Promise((resolve, reject) => {
    Category.findOne({
      user: userId,
      name: categoryName,
    })
      .then((categoryExists) => {
        if (categoryExists !== null) resolve(true);
        resolve(false);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const addCategories = asyncHandler(async (req, res) => {
  const { categoryName } = req.body;

  const userId = req.user.id;

  const { error } = await categorySchema.validateAsync({ categoryName });

  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found!" });

    checkCategoryExists(userId, categoryName)
      .then(async (result) => {
        if (result) {
          return res.status(400).json({ message: "Category already exists!" });
        }
        const newCategories = await Category.create({
          name: categoryName,
          user: user._id,
        });
        return res.status(201).json({
          message: "Category created successfully",
          category: newCategories,
        });
      })
      .catch((error) => {
        return res.status(500).json({ message: error.message });
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


const likePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found!" });

    if (post.isLiked) {
      const unlikePost = await Post.updateOne(
        { _id: mongoose.Types.ObjectId(postId) },
        { $pull: { likes: mongoose.Types.ObjectId(userId) }, isLiked: false }

      );
      return res
        .status(201)
        .json({ message: "Post unliked successfully!", unlikePost, post });
    }

    if (!post.isLiked) {
     const newLike = await Post.updateOne(
        { _id: mongoose.Types.ObjectId(postId) },
        { $push: { likes: mongoose.Types.ObjectId(userId) }, isLiked: true }
      );

      return res
        .status(201)
        .json({ message: "Post liked successfully!", newLike, post });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});




const getPostsCountInCategory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const categoryId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found!" });

    const getPostsCount = await Category.aggregate([
      {
        $match: {
          _id: categoryId,
        },
      },

      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "category",
          as: "posts",
        },
      },

      {
        $project: {

          totalCount: { 

            $cond: [
              { $ifNull: ["$posts", false] },
              {
                $cond: [
                  { $eq: [{ $size: "$posts" }, 0] },
                  { message: "Array is empty" },
                  { $size: "$posts" },
                ],
              },
              {
                message: "No posts found in this category",
              },
            ],

          },

        },
      },


    ]);

    return res.status(200).json(getPostsCount);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const addPost = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const userId = req.user.id;

  if (!userId) return res.status(400).json({ message: "User is required!" });
  
  if (!category) return res.status(400).json({ message: "Category is required!" });

  const { error } = await postSchema.validateAsync({
    title: title,
    description: description,
    category: category,
    }
    );
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
 

    const getCategory = await Category.find({ user: userId });

    if (!getCategory)
      return res.status(404).json({
          message: "Category not found, please add a valid category from the list of categories!",
        });

    

      if (!getCategory.some((cat) => cat.name === category) )
      return res.status(400).json({
        message: "Please add a valid category from the list of categories!",
      });

      const selectedCategory = getCategory.find((cat) => cat.name === category);
     const categoryId = selectedCategory ? selectedCategory._id : undefined || null;


     if (!categoryId) return res.status(400).json({ message: "This " + category + " category does not exist!"});



    const newPost = await Post.create ({
      title: title,
      description: description,
      user: mongoose.Types.ObjectId(userId),
      category: mongoose.Types.ObjectId(categoryId),
    });

    const categoryName = await newPost.populate("category")
    


   

    return res.status(201).json({
      message: "Post created successfully!",
      post: newPost,
      category: categoryName,
      
    });




    
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = {
  addPost,
  getAllPosts,
  getOnePost,
  deletePost,
  getMyPosts,
  updatePost,
  getSearchResults,
  addCategories,
  getAllCategories,
  getPostsCountInCategory,
  likePost,
};
