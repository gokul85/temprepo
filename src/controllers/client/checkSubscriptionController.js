import UserSubscription from "../../db/model/user_subscription.js";
import {JWT} from "../../auth/tokens.js";
import User from "../../db/model/users.js";

const CheckSubscriptionValidity = async (req,res) => {
    try{
        let token = JWT.getToken(req.headers);
        if(token){
            let {userId} = JWT.parseToken(token)
            if(userId){
                let planInfo = await UserSubscription.findOne({userId : userId}).populate("plan_type",  "plan_price");
                let currentDate = new Date();
                let endDate = planInfo.end_date;
                let isValid = currentDate <= endDate;
                if(isValid){
                    let plan_price = planInfo.plan_type.plan_price;
                    if(plan_price === 0){
                        let userInfo = await User.findOne({_id : userId});
                        let userCredits = userInfo.credits_used;
                        if(userCredits <= 5){
                            let updateUserCredits = await User.updateOne({_id : userId},{credits_used : userCredits + 1});
                            res.status(200).json({
                                valid : true
                            });
                        }else{
                            res.status(409).json({message : "Please subscribe to view the quest"});
                        }
                    }else{
                        res.status(200).json({
                            valid : true
                        });
                    }
                }else{
                    res.status(409).json({message : "Please subscribe to view the quest"});
                }
            }
        }else{
            res.status(409).json({message : "Please subscribe to view the quest"});
        }
    }catch(e){
        res.status(500).json("Something went wrong");
    }
} 

export const subscriptionValidityController = {
    get : CheckSubscriptionValidity
}