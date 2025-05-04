const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Database connected successfully');
})

connection.on('error', (err) => {
    console.log('Database connection error: ', err);
})

module.exports = mongoose;

// const mongoose = require("mongoose");
// const Class = require("../models/classModel"); 

// mongoose.connect(process.env.MONGO_URL);

// const connection = mongoose.connection;

// connection.on('connected', async () => {
//   console.log('Database connected successfully');

//   // Drop old 'name_1' index if it exists
//   try {
//     const indexes = await Class.collection.indexes();
//     const hasOldIndex = indexes.find((i) => i.name === "name_1");
//     if (hasOldIndex) {
//       await Class.collection.dropIndex("name_1");
//       console.log("Dropped old 'name_1' index from Classes collection");
//     }
//   } catch (err) {
//     console.error("Error dropping old index:", err.message);
//   }
// });

// connection.on('error', (err) => {
//   console.log('Database connection error: ', err);
// });

// module.exports = mongoose;
