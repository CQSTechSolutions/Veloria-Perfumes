import mongoose from "mongoose";

const dbConn = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to Mongodb ${db.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

export default dbConn;