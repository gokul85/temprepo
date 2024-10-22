import mongoose from "mongoose";

const connectDb = async (url) => {
  try{
    mongoose.set("strictQuery", true);
    mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to database");
    }).catch(e => console.log(e.message));
    return {
      status : true,
      message : "Database connected successfully"
    }
  }catch(e){
    return {
      status : false,
      message : e.message
    };
  }
};

export default connectDb;