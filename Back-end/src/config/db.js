import mongoose from "mongoose";

const connecteDB = async () => {
  try {
        await mongoose.connect(process.env.MONGO_URI); 
        console.log("MongoDB connecté");
    } catch (error) {
        console.error("Erreur de connexion MongoDB:", error);
        process.exit(1);
    }
};

export default connecteDB;
        