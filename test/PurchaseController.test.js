const PurchaseController = require("../controllers/PurchaseConrollers");
const { Product, Purchase, sequelize } = require("../models");

const mockRequest = (body = {}, user = {}) => ({ body, user });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

jest.mock("../models", () => ({
  Product: { findByPk: jest.fn() },
  Purchase: { create: jest.fn() },
  sequelize: { transaction: jest.fn() },
}));

describe("PurchaseController.addPurchase", () => {
  let commitMock;
  let rollbackMock;
  let fakeTransaction;

  beforeEach(() => {
    commitMock = jest.fn();
    rollbackMock = jest.fn();
    fakeTransaction = { commit: commitMock, rollback: rollbackMock };
    require("../models").sequelize.transaction.mockResolvedValue(
      fakeTransaction
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new purchase and return 201", async () => {
    const req = mockRequest({ productId: 1 }, { id: 99 });
    const res = mockResponse();

    const fakeProduct = { id: 1, name: "Air Mineral" };
    const fakePurchase = { id: 10, userId: 99, productId: 1 };

    require("../models").Product.findByPk.mockResolvedValue(fakeProduct);
    require("../models").Purchase.create.mockResolvedValue(fakePurchase);

    await PurchaseController.addPurchase(req, res);

    expect(require("../models").Product.findByPk).toHaveBeenCalledWith(1);
    expect(require("../models").Purchase.create).toHaveBeenCalledWith(
      { userId: 99, productId: 1 },
      { transaction: expect.any(Object) }
    );
    expect(commitMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Purchase berhasil",
      data: fakePurchase,
    });
  });

  it("should return 400 if productId not provided", async () => {
    const req = mockRequest({}, { id: 99 });
    const res = mockResponse();

    await PurchaseController.addPurchase(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Gagal purchase",
      error: "productId wajib diisi",
    });
  });

  it("should return 404 if product not found", async () => {
    const req = mockRequest({ productId: 2 }, { id: 99 });
    const res = mockResponse();

    require("../models").Product.findByPk.mockResolvedValue(null);

    await PurchaseController.addPurchase(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Produk tidak ditemukan",
    });
  });
});
