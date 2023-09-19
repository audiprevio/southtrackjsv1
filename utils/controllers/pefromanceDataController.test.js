const { postPerformanceData, getPerformanceData, putPerformanceData, patchPerformanceData } = require('../../controllers/performanceDataController');

jest.mock('../../models/allModel', () => {
  const mockPerformanceData = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn()
  };

  function MockPerformanceData() {
    return this;
  }
  MockPerformanceData.prototype.save = jest.fn();

  return {
    PerformanceData: Object.assign(MockPerformanceData, mockPerformanceData),
  };
});

const mockPerformanceData = require('../../models/allModel').PerformanceData;

describe('performanceDataController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('postPerformanceData', async () => {
    const req = { body: { totalPenguinTracked: 100, lastUpdated: new Date() } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    await postPerformanceData(req, res);
  
    expect(mockPerformanceData.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('getPerformanceData', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const performanceData = { totalPenguinTracked: 100, lastUpdated: new Date() };
    mockPerformanceData.findOne.mockResolvedValue(performanceData);

    await getPerformanceData({}, res);

    expect(mockPerformanceData.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(performanceData);
  });

  test('putPerformanceData', async () => {
    const req = { body: { totalPenguinTracked: 200, lastUpdated: new Date() } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    await putPerformanceData(req, res);
  
    expect(mockPerformanceData.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('patchPerformanceData', async () => {
    const req = { body: { totalPenguinTracked: 300, lastUpdated: new Date() } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const performanceData = { totalPenguinTracked: 300, lastUpdated: new Date() };
    mockPerformanceData.findOneAndUpdate.mockResolvedValue(performanceData);

    await patchPerformanceData(req, res);

    expect(mockPerformanceData.findOneAndUpdate).toHaveBeenCalledWith({}, { totalPenguinTracked: req.body.totalPenguinTracked, lastUpdated: req.body.lastUpdated }, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(performanceData);
  });
});
