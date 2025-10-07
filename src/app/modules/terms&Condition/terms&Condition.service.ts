import { TTermsCondition } from "./terms&Condition.interface";
import { TermsConditionModel } from "./terms&Condition.model";


const updateTermsConditionFromDB = async (payload : TTermsCondition, id : string) => {
    const result = await TermsConditionModel.findByIdAndUpdate(id, payload, {new : true});
    return result
} 

const readTermsConditionFromDB = async () => {
    const result = await TermsConditionModel.find({});
    return result
}

export const termsConditionService = {
    updateTermsConditionFromDB,
    readTermsConditionFromDB
}