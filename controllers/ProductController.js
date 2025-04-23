const { Product } = require("../models");

class ProductController {
  static async addProduct(req, res, next) {
    try {
      const { name, price } = req.body;

      if (!name || !price) {
        throw { status: 400, message: "Name and price are required" };
      }

      const product = await Product.create({ name, price });

      res.status(201).json({
        message: "Product successfully added",
        product,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllProducts(req, res, next) {
    try {
      const products = await Product.findAll({
        attributes: ["id", "name", "price"],
        order: [["id", "ASC"]],
      });

      res.status(200).json({
        message: "List of products",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
