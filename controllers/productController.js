import productModel from "../models/productModel.js";
import { cloudinary } from "../cloudinary/cloudinaryConfig.js";

// Alle Produkte abrufen
async function getProducts(req, res) {
  try {
    const products = await productModel.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen der Produkte" });
  }
}

async function createProduct(req, res) {
  const { name, description, image } = req.body;

  const uploadedImage = await cloudinary.uploader.upload(
    image,
    {
      upload_preset: "cloudinary",
      public_id: `${name}`,
      allowed_formats: [
        "jpg",
        "png",
        "jpeg",
        "gif",
        "svg",
        "webp",
        "jfif",
        "ico",
      ],
    },
    function (error, result) {
      if (error) throw error;
    }
  );

  console.log("Cloudinary Objekt", uploadedImage);

  const cloudImg = uploadedImage.secure_url;

  const cloudImgPub = uploadedImage.public_id;

  try {
    const product = new productModel({
      name,
      description,
      image: cloudImg, // hier wird das Bildpfad gespeichert
      imgpub: cloudImgPub, // hier wird das public_id gespeichert
    });
    await product.save();
    res.status(201).json({ message: "Product erfolgreich gespeichert" });
  } catch (error) {
    res.status(500).json({ message: "Fehler bei der Speicherung" });
  }
}

// @desc   Delete a product
// @route  DELETE /products/:id

async function deleteProduct(req, res) {
  const product = await productModel.findById(req.params.id);

  if (product) {
    // lösche das Bild in Cloudinary
    await cloudinary.uploader.destroy(product.imgpub);
    // lösche das Produkt in der Datenbank
    await productModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Produkt gelöscht!" });
  } else {
    res.status(404);
    throw new Error("Produkt nicht gefunden!");
  }
}

export { getProducts, createProduct, deleteProduct };
