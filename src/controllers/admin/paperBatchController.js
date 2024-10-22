import PapersBatch from "../../db/model/paper_batch.js";

const addNewBatch = async (req, res) => {
  try {
    let batchStatus = await PapersBatch.create(req.body);
    if(batchStatus){
        res.status(201).json("Batch created successfully");
    }
  } catch (e) {
    
    res.status(500).json({ message: "something went wrong" });
  }
};

const deleteBatch = async (req, res) => {
  try {
    let batchStatus = await PapersBatch.deleteOne({ _id: req.params.id })
    if(batchStatus){
        res.status(200).json("deleted successfully");
    }
  } catch (e) {
    
    res.status(500).json({ message: "something went wrong" });
  }
};

const updateBatch = async (req, res) => {
  try {
    let batchStatus = await PapersBatch.updateOne({ _id: req.params.id }, req.body)
    if(batchStatus){
        res.status(200).json("Updated successfully");
    }
  } catch (e) {
    
    res.status(500).json({ message: "something went wrong" });
  }
};

const getBatch = async (req, res) => {
    try {
      let batch = await PapersBatch.find({});
      res.status(200).json(batch);
    } catch (e) {
      
      res.status(500).json({ message: "something went wrong" })
    }
  };
  
export const PaperBatchControllers = {
  post: addNewBatch,
  get : getBatch,
  delete : deleteBatch,
  put : updateBatch
};
