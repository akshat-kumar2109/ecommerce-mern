import Products from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

// add product -- ADMIN
export const addProduct = async (req, res) => {
  const { name, description, price, category, stock } = JSON.parse(
    req.body.data
  );

  const images = req.files.images;

  // check if body has the required fields
  if (!name || !description || !price || !images || !category || !stock) {
    // status code 400 means "No content"
    return res.status(400).json({
      success: false,
      error: "Required fields are missing",
    });
  }

  if (price > 99999999) {
    return res.stauts(400).json({
      success: false,
      error: "You can't have price more than 99999999",
    });
  }

  if (stock > 9999) {
    return res.stauts(400).json({
      success: false,
      error: "You can't have stock more than 9999",
    });
  }

  try {
    const imagesLinks = [];

    if (images.length) {
      for (let i = 0; i < images.length; i++) {
        const result = await new Promise((resolve) => {
          cloudinary.uploader
            .upload_stream((error, uploadResult) => {
              return resolve(uploadResult);
            })
            .end(images[i].data);
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    } else {
      const result = await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream((error, uploadResult) => {
            return resolve(uploadResult);
          })
          .end(images.data);
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const data = {
      name,
      description,
      price,
      images: imagesLinks,
      category,
      stock,
      user: res.locals.verify._id,
    };

    const product = await Products.create(data);

    console.log(product);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status().json({
      success: false,
      error: "Adding product failed",
      error,
    });
  }
};
