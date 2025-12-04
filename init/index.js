const mongoose = require('mongoose');
const Listing = require("../Models/listing");
const initData = require("./data")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
        console.log("Connected to MongoDB");
}).catch(err => {
        console.log(err);
})

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner: "691e0d0b7860efbf21c7aa1b"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was Initialised");
}

initDB();




