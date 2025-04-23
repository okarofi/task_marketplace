const ProductController = require("../controllers/ProductController");
const { Product } = require("../models");

// Mock res dan req
const mockRequest = (body = {}) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

jest.mock("../models", () => ({
  Product: {
    create: jest.fn(),
  },
}));

describe("ProductController.addProduct", () => {
  it("should return 201 and product data if input valid", async () => {
    const req = mockRequest({ name: "Air Mineral", price: 5000 });
    const res = mockResponse();

    const fakeProduct = { id: 1, name: "Air Mineral", price: 5000 };
    Product.create.mockResolvedValue(fakeProduct);

    await ProductController.addProduct(req, res);

    expect(Product.create).toHaveBeenCalledWith({
      name: "Air Mineral",
      price: 5000,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Product successfully added",
      product: fakeProduct,
    });
  });

  it("should return 400 if name or price is missing", async () => {
    const req = mockRequest({ name: "" });
    const res = mockResponse();
    const next = jest.fn();

    await ProductController.addProduct(req, res, next);

    expect(next).toHaveBeenCalledWith({
      status: 400,
      message: "Name and price are required",
    });
  });
});
