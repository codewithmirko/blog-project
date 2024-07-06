const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");

// @CREATE A NEW POST
// @POST: api/posts
// @private
const createPost = async (req, res, next) => {
  try {
    let { title, category, body } = req.body;

    if (!title || !category || !body || !req.files) {
      return next(new HttpError("Fill in all fields and thumbnail", 422));
    }

    const { thumbnail } = req.files;

    // check size

    if (thumbnail.size > 2000000) {
      return next(new HttpError("Thumbnail should be less than 2 MB"));
    }

    let fileName = thumbnail.name;
    let splittedFilename = fileName.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];

    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFilename),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        } else {
          const newPost = await Post.create({
            title,
            body,
            category,
            thumbnail: newFilename,
            creator: req.user.id,
          });
          if (!newPost) {
            return next(new HttpError("Post couldnt be created", 422));
          }
          //find user and increase post count by 1

          const currentUser = await User.findById(req.user.id);
          const userPostCount = currentUser.posts + 1;
          await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

          res.status(201).json(newPost);
        }
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

// @GET ALL POSTS
// @GET: api/posts
// @public
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// @GET SINGLE POST
// @GET: api/posts/:id
// @private
const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// @GET POSTS BY CATEGORY
// @GET: api/posts/categories/:category
// @public
const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;

    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// @GET POSTS BY AUTHOR
// @GET: api/posts/users/:id
// @public
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;

    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// @EDIT POST
// @PATCH: api/posts/:id
// @private
const editPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { title, category, body } = req.body;

    if (!title || !category || body.length < 12) {
      return next(new HttpError("Fill in all fields", 422));
    }

    let updatedPost;
    if (!req.files) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, body },
        { new: true }
      );
    } else {
      // Get old post from database
      const oldPost = await Post.findById(postId);
      if (!oldPost) {
        return next(new HttpError("Post not found", 404));
      }

      // Delete old thumbnail
      const oldThumbnailPath = path.join(
        __dirname,
        "..",
        "uploads",
        oldPost.thumbnail
      );
      fs.unlink(oldThumbnailPath, (err) => {
        if (err) {
          return next(new HttpError("Failed to remove old thumbnail", 500));
        }
      });

      // Upload new thumbnail
      const { thumbnail } = req.files;
      const fileName = thumbnail.name;
      const splittedFilename = fileName.split(".");
      const newFilename = `${splittedFilename[0]}_${uuid()}.${
        splittedFilename[splittedFilename.length - 1]
      }`;

      const uploadPath = path.join(__dirname, "..", "uploads", newFilename);
      thumbnail.mv(uploadPath, async (err) => {
        if (err) {
          return next(new HttpError("File upload failed", 500));
        }
      });

      // Update post with new thumbnail
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, body, thumbnail: newFilename },
        { new: true }
      );
    }

    if (!updatedPost) {
      return next(new HttpError("Couldn't update post", 400));
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new HttpError("Updating post failed", 500));
  }
};

// @DELETE POST
// @DELETE: api/posts/:id
// @private
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post unavailable", 400));
    }

    const post = await Post.findById(postId);
    const fileName = post?.thumbnail;
    if (req.user.id == post.creator) {
      //delete thumbnail from folder
      fs.unlink(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          } else {
            await Post.findByIdAndDelete(postId);
            // Find user and reduce post count
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
            res.json(`Post ${postId} deleted`);
          }
        }
      );
    } else {
      return next(new HttpError("Post could not be deleted", 403));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
