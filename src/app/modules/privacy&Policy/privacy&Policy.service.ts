import { TPrivacyPolicy } from "./privacy&Policy.interface";
import { PrivacyPolicyModel } from "./privacy&Policy.model";

const updatePrivacyPolicyFromDB = async (payload : TPrivacyPolicy, id : string) => {
    const result = await PrivacyPolicyModel.findByIdAndUpdate(id, payload);
    return result
} 

const readPrivacyPolicyFromDB = async () => {
    const result = await PrivacyPolicyModel.find({});
    return result
}

export const privacyPolicyService = {
    updatePrivacyPolicyFromDB,
    readPrivacyPolicyFromDB
}