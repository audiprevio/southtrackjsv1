const { addPenguinData, getAllPenguinData, updatePenguinData } = require('../../controllers/penguinController');

jest.mock('../../models/allModel', () => {
  const mockPenguinData = {
    findOne: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn()
  };

  function MockPenguinData() {
    return this;
  }
  MockPenguinData.prototype.save = jest.fn();

  return {
    penguinData: Object.assign(MockPenguinData, mockPenguinData),
  };
});

const mockPenguinData = require('../../models/allModel').penguinData;

describe('penguinController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('addPenguinData', async () => {
    const req = { body: { penguinName: 'test', lastPosition: [0, 0], lastUpdate: 'test', speciesName: 'test', ageAtTagging: 'test', taggedPosition: 'test', taggedTime: 'test', taggedBy: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    mockPenguinData.findOne.mockResolvedValue(null);
  
    await addPenguinData(req, res);
  
    expect(mockPenguinData.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'New penguin data added successfully - wenk wenk!' });
  });

  test('getAllPenguinData', async () => {
    const res = { json: jest.fn() };
    const penguins = [{ penguinName: 'test' }];
    mockPenguinData.find.mockResolvedValue(penguins);

    await getAllPenguinData({}, res);

    expect(mockPenguinData.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(penguins);
  });

  test('updatePenguinData', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const req = { body: { id: 'test', lastPosition: [0, 0] } };
    const penguin = { _id: 'test', penguinName: 'test', lastPosition: [0, 0] };
    mockPenguinData.findOneAndUpdate.mockResolvedValue(penguin);

    await updatePenguinData(req, res);

    expect(mockPenguinData.findOneAndUpdate).toHaveBeenCalledWith({ _id: req.body.id }, { lastPosition: req.body.lastPosition }, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Penguin data updated successfully', penguin });
  });
});
