
export const CreateObject = (obj,p_id,t_id,t_name,c_id) => {
    let resultObject = {
        s_no : obj.s_no,
        question_number : obj.question_number,
        question : obj.question,
        answer : obj.answer,
        options : [obj.option_1,obj.option_2,obj.option_3,obj.option_4],
        paper : obj.paper,
        variant : obj.varient,
        year : obj.year,
        month : obj.month,
        paper_id : p_id,
        topic : t_id,
        topicName : t_name,
        chapter : c_id,
    }
    return resultObject;
}