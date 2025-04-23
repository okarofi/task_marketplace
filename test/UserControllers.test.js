const UserControllers = require("../controllers/UserControllers");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mock semua dependensi
jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockRequest = (body = {}) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("UserControllers.registerUser", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return 201 when user successfully registered", async () => {
    const req = mockRequest({
      name: "Oka",
      email: "oka@mail.com",
      password: "123456",
    });
    const res = mockResponse();
    const next = jest.fn();

    User.findOne.mockResolvedValue(null); // email belum terdaftar
    bcrypt.hash.mockResolvedValue("hashed_password");
    User.create.mockResolvedValue({
      name: "Oka",
      email: "oka@mail.com",
      role: "user",
    });

    await UserControllers.registerUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Register successful",
      user: {
        name: "Oka",
        email: "oka@mail.com",
        role: "user",
      },
    });
  });

  it("should return 409 when email already registered", async () => {
    const req = mockRequest({
      name: "Oka",
      email: "oka@mail.com",
      password: "123456",
    });
    const res = mockResponse();
    const next = jest.fn();

    User.findOne.mockResolvedValue({ id: 1, email: "oka@mail.com" });

    await UserControllers.registerUser(req, res, next);

    expect(next).toHaveBeenCalledWith({
      status: 409,
      message: "Email already registered",
    });
  });
});

describe("UserControllers.loginUser", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return 200 and accessToken if login valid", async () => {
    const req = mockRequest({
      email: "oka@mail.com",
      password: "123456",
    });
    const res = mockResponse();
    const next = jest.fn();

    const fakeUser = {
      id: 1,
      email: "oka@mail.com",
      password: "hashed_password",
    };

    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake.jwt.token");

    await UserControllers.loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "fake.jwt.token",
    });
  });

  it("should return 401 if password is invalid", async () => {
    const req = mockRequest({
      email: "oka@mail.com",
      password: "wrong",
    });
    const res = mockResponse();
    const next = jest.fn();

    const fakeUser = {
      id: 1,
      email: "oka@mail.com",
      password: "hashed_password",
    };

    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(false); // password salah

    await UserControllers.loginUser(req, res, next);

    expect(next).toHaveBeenCalledWith({
      status: 401,
      message: "Invalid email or password",
    });
  });

  it("should return 401 if user not found", async () => {
    const req = mockRequest({
      email: "notfound@mail.com",
      password: "any",
    });
    const res = mockResponse();
    const next = jest.fn();

    User.findOne.mockResolvedValue(null);

    await UserControllers.loginUser(req, res, next);

    expect(next).toHaveBeenCalledWith({
      status: 401,
      message: "Invalid email or password",
    });
  });
});
