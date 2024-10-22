import excelToJson from "convert-excel-to-json";

export const ConvertSheet = async (filePath) => {
  try {
    const excelData = excelToJson({
      sourceFile: filePath,
      header: {
        rows: 1,
      },
      columnToKey: {
        // "*" : "{{columnHeader}}"
        A: "s_no",
        B: "question_number",
        C: "question",
        D: "chapter",
        E: "topic",
        F: "repetition",
        G: "option_1",
        H: "option_2",
        I: "option_3",
        J: "option_4",
        K: "answer",
        L: "paper",
        M: "varient",
        N: "month",
        O: "year",
      },
    });
    if (!excelData) {
      return false;
    } else {
      return excelData;
    }
  } catch (e) {
    return {
      status : false,
      message : "Error in creating the excel object"
    }
  }
};
