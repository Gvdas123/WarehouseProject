
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const productRoutes = require('./routes/productRoutes');
const projectRoutes = require('./routes/projectRoutes');
const designatedProductRoutes = require('./routes/designatedProductRoutes');
const userRoutes = require('./routes/userRoutes');
const objectProductsRoutes = require('./routes/objectProductsRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PATCH','PUT', 'DELETE'],
}));
app.use(bodyParser.json());

const mongoURI = "mongodb+srv://admin:7PNpbRCtonxBf1TG@cluster0.a1i40c6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

app.use('/products', productRoutes);
app.use('/projects', projectRoutes);
app.use('/designated-products', designatedProductRoutes);
app.use('/users', userRoutes);
app.use('/object-products', objectProductsRoutes);
app.use('/auth', authRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
