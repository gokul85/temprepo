import PapersBatch from "../db/model/paper_batch.js";

export const getSortedPapers = async (papers) => {
  try {
    // Fetch paper batches
    const paperBatches = await PapersBatch.find().exec();

    // Sort paper batches based on the current month
    const currentMonth = new Date()
      .toLocaleString("en-US", { month: "short" })
      .toLowerCase();
    paperBatches.sort((a, b) => {
      const indexOfA = a.batch_title.toLowerCase().indexOf(currentMonth);
      const indexOfB = b.batch_title.toLowerCase().indexOf(currentMonth);
      return indexOfA - indexOfB;
    });

    // Organize papers by paper batches
    const organizedPapers = {};
    paperBatches.forEach((batch) => {
      const batchPapers = papers.filter(
        (paper) => paper.batch_id && paper.batch_id.equals(batch._id)
      );
      if (batchPapers.length > 0) {
        organizedPapers[batch.batch_title] = batchPapers;
      }
    });

    return organizedPapers;
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
    throw error;
  }
};
