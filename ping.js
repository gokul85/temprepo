import connectDb from "./src/db/config/dbConfig.js"
const uri = process.env.MONGO_DB_URI;
const PingTime = (req,res) => {
    res.status(200).json({
        message : "Server is healthy",
        timeZone : new Date().getTime()
    })
}

const PingDb = async (req,res) => {
    try{
        const {status, message} = await connectDb(uri);
        if(status){
            res.status(200).json({
                message : "Database is healthy",
                timeZone : new Date().getTime()
            })
        }else{
            res.status(200).json({
                message : "Database is not connected",
                timeZone : new Date().getTime(),
                error : message
            })
        }
    }catch(e){
        res.status(200).json({
            message : "Database is not connected",
            timeZone : new Date().getTime()
        })
        return false;
    }
}
export default {PingTime , PingDb}