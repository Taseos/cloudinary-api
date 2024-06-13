import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  imgpub: String, // hier wird das public_id von Cloudinary gespeichert um das Bild später zu löschen
});

const productModel = mongoose.model("product", ProductSchema);

export default productModel;
