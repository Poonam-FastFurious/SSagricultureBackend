// controllers/blogController.js

import { BlogPost } from "../models/Blog.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { uploadOnCloudinary } from "../utils/Cloudinary.js"; // Assuming you have this utility function

const createBlogPost = asyncHandler(async (req, res) => {
      try {
            if (!req.body) {
                  throw new ApiError(400, "Request body is missing or empty");
            }

            const { title, content, author, thumbnail, gallery } = req.body;

            if (![title, content, author].every((field) => field?.trim())) {
                  throw new ApiError(400, "Title, content, and author are required fields");
            }

            let thumbnailUrl = thumbnail; // Default to the provided thumbnail URL
            let galleryUrls = gallery || []; // Default to the provided gallery URLs array

            // Upload thumbnail image to Cloudinary if a local file path is provided
            if (req.files?.thumbnail) {
                  const thumbnailLocalPath = req.files.thumbnail[0].path;
                  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
                  thumbnailUrl = uploadedThumbnail.url;
            }

            // Upload gallery images to Cloudinary if local file paths are provided
            if (req.files?.gallery && req.files.gallery.length > 0) {
                  for (const file of req.files.gallery) {
                        const uploadedImage = await uploadOnCloudinary(file.path);
                        galleryUrls.push(uploadedImage.url);
                  }
            }

            const blogPostData = {
                  title,
                  content,
                  author,
                  thumbnail: thumbnailUrl,
                  gallery: galleryUrls,
            };

            const blogPost = await BlogPost.create(blogPostData);

            return res.status(201).json({
                  success: true,
                  data: blogPost,
                  message: "Blog post created successfully",
            });
      } catch (error) {
            console.error("Error creating blog post:", error);

            return res.status(500).json({
                  success: false,
                  message: "Internal server error",
            });
      }
});
const getAllBlogPosts = asyncHandler(async (req, res) => {
      try {
            const blogPosts = await BlogPost.find().sort({ createdAt: -1 }); // Assuming you want to sort by createdAt descending

            return res.status(200).json({
                  success: true,
                  data: blogPosts,
                  message: "Successfully retrieved all blog posts",
            });
      } catch (error) {
            console.error("Error fetching blog posts:", error);

            return res.status(500).json({
                  success: false,
                  message: "Internal server error",
            });
      }
});
const getBlogById = asyncHandler(async (req, res) => {
      try {
            const { id } = req.query;

            // Validate if the ID is valid (this depends on your application's logic)
            if (!id) {
                  throw new ApiError(400, "Blog ID parameter is missing");
            }

            const blogPost = await BlogPost.findById(id);

            if (!blogPost) {
                  throw new ApiError(404, "Blog post not found");
            }

            return res.status(200).json({
                  success: true,
                  data: blogPost,
                  message: "Blog post retrieved successfully",
            });
      } catch (error) {
            console.error("Error fetching blog post:", error);

            if (error instanceof ApiError) {
                  return res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                  });
            }

            return res.status(500).json({
                  success: false,
                  message: "Internal server error",
            });
      }
});

export { createBlogPost, getAllBlogPosts, getBlogById };
