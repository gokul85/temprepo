import UserSubscription from "../../db/model/user_subscription.js";
import { getUserId } from "../../helpers/getUserId.js";

const getUserCurrentPlan = async (req,res) => {
    try{
        let userId = getUserId(req.headers);
        if(userId){
            let planInfo = await UserSubscription.findOne({userId : userId}).populate("plan_type");
            res.status(200).json(planInfo)
        }else{
            res.status(401).json({message : "Unauthorized"})
        }
    }catch(e){
        
        res.status(500).json({message : "Something went wrong"})
    }
}

export const UserPlanInfoController = {
    get : getUserCurrentPlan
}