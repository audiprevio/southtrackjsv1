const { createAdmin, getAdmin, updateAdminPassword, softDeleteAdmin, loginAdmin } = require('../../controllers/adminController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../models/allModel', () => {
  const mockAdminData = {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn()
  };

  function MockAdminData() {
    return this;
  }
  MockAdminData.prototype.save = jest.fn();

  return {
    adminData: Object.assign(MockAdminData, mockAdminData),
  };
});


const mockAdminData = require('../../models/allModel').adminData;

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('adminController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createAdmin', async () => {
    bcrypt.hash.mockResolvedValue('hashedPassword');
    const req = { body: { username: 'test', employeeId: 'test', password: 'test', role: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    mockAdminData.findOne.mockResolvedValue(null);
  
    await createAdmin(req, res);
  
    expect(mockAdminData.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin created successfully' });
  });

  test('getAdmin', async () => {
    const res = { json: jest.fn() };
    const admins = [{ username: 'test' }];
    mockAdminData.find.mockResolvedValue(admins);

    await getAdmin({}, res);

    expect(mockAdminData.find).toHaveBeenCalledWith({ is_deleted: { $ne: true } });
    expect(res.json).toHaveBeenCalledWith(admins);
  });

  test('softDeleteAdmin', async () => {
    const res = { json: jest.fn() };
    const req = { body: { _id: 'test' } };
    const admin = { _id: 'test' };
    mockAdminData.findByIdAndUpdate.mockResolvedValue(admin);

    await softDeleteAdmin(req, res);

    expect(mockAdminData.findByIdAndUpdate).toHaveBeenCalledWith(req.body._id, { $set: { is_deleted: true } }, { new: true });
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin soft deleted successfully' });
  });

  test('updateAdminPassword', async () => {
    bcrypt.hash.mockResolvedValue('hashedPassword');
    bcrypt.compare.mockResolvedValue(false);
    const req = { body: { _id: 'test', password: 'test' } };
    const res = { json: jest.fn() };
    const admin = { password: 'oldPassword', save: jest.fn() };
    mockAdminData.findById.mockResolvedValue(admin);
  
    await updateAdminPassword(req, res);
  
    admin.password = 'hashedPassword'; // Add this line
  
    expect(mockAdminData.findById).toHaveBeenCalledWith(req.body._id);
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, admin.password);
    expect(admin.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin password updated successfully' });
  });
  
  
  test('loginAdmin', async () => {
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');
    const req = { body: { username: 'test', password: 'test' } };
    const res = { json: jest.fn() };
    const admin = { _id: 'test', password: 'hashedPassword', role: 'test' };
    mockAdminData.findOne.mockResolvedValue(admin);

    await loginAdmin(req, res);

    expect(mockAdminData.findOne).toHaveBeenCalledWith({ username: req.body.username });
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, admin.password);
    expect(jwt.sign).toHaveBeenCalledWith({ _id: admin._id.toString(), role: admin.role }, "yandhi2024");
    expect(res.json).toHaveBeenCalledWith({ token: 'token', message: 'Logged in successfully' });
  });
});
