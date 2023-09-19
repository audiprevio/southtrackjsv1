const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoose_delete = require('mongoose-delete');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml')
const fs = require('fs')
const OpenApiValidator = require('express-openapi-validator');
require('dotenv').config()


require('dotenv').config();

const openApiPath = './openapi.yaml'
const file = fs.readFileSync(openApiPath, 'utf8')
const swaggerDocument = yaml.parse(file)

const app = express()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(bodyParser.json());
app.use(OpenApiValidator.middleware({
    apiSpec: openApiPath,
    validateRequests: true
}))

app.use((req, res, next) => {
    console.log("<========= sending request =====")
    next()
})

mongoose.connect(process.env.MONGO_URI);

const authMiddleware = require('./middleware/authMiddleware');
const penguinController = require('./controllers/penguinController');
const adminController = require('./controllers/adminController');
const performanceDataController = require("./controllers/performanceDataController");
const roleCheck = require('./middleware/roleCheck');

//<--- admin management -->// req: superadmin should be able to create and delete admin//)
app.post('/admin/createadmin', authMiddleware, roleCheck(['superadmin']), adminController.createAdmin); // ✅   // ---> need auth as superadmin
app.get('/admin/getadmin', authMiddleware, roleCheck(['superadmin']), adminController.getAdmin); // ✅  // --> need auth as superadmin
app.delete('/admin/softdeleteadmin/:id', authMiddleware, roleCheck(['superadmin']), adminController.softDeleteAdmin); // ✅  // ---> need auth as superadmin
app.put('/admin/updateadminpassword/:id', adminController.updateAdminPassword);
app.post('/admin/login', adminController.loginAdmin); // ✅

//<--- penguin management -->//
app.get('/admin/penguins', penguinController.getAllPenguinData); // ✅
app.post('/admin/penguins/addpenguin', penguinController.addPenguinData); // ✅ authMiddleware, roleCheck(['superadmin', 'developer'])
app.put('/admin/penguins/edit', authMiddleware, penguinController.updatePenguinData);// ✅

//<--performance management -->//
app.post('/admin/postPerformanceData', authMiddleware, performanceDataController.postPerformanceData);
app.get('/admin/getperformancedata', performanceDataController.getPerformanceData);
app.put('/admin/putperformancedata', authMiddleware, performanceDataController.putPerformanceData);
app.patch('/admin/patchperformancedata', authMiddleware, performanceDataController.patchPerformanceData)


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        erros: err.errors
    })
})

console.log('Successfully saved all changes.');

app.listen(3000, '0.0.0.0', function (){
    console.log('Connection Established. Server is Running on Port 3000.');
});

//0.0.0.0:3000