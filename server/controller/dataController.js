const Tour = require("../models/tourModels");

class APIFeatcher {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);

        // 2) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        return this
    }

    fildes() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        return this
    }

    pagination() {
        const page = parseInt(this.queryString.page, 10) || 1; // Default to page 1 if not provided
        const limit = parseInt(this.queryString.limit, 10) || 10 // Default to 10 documents per page if not provided
        const skip = (page - 1) * limit;


        // Check if the skip value exceeds the total number of documents

        this.query = this.query.skip(skip).limit(limit)
        return this

    }
}



exports.getAllData = async (req, res) => {
    try {


        // const queryObj = { ...req.query };
        // const excludeFields = ["page", "sort", "limit", "fields"];
        // excludeFields.forEach((el) => delete queryObj[el]);

        // // 2) Advanced filtering
        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        // const parsedQuery = JSON.parse(queryStr);

        // let query = Tour.find(parsedQuery)


        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy);
        // }

        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // }


        // const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
        // const limit = parseInt(req.query.limit, 10) || 10 // Default to 10 documents per page if not provided
        // const skip = (page - 1) * limit;

        // const totalDocuments = await Tour.countDocuments();

        // // Check if the skip value exceeds the total number of documents
        // if (skip >= totalDocuments) {
        //     return res.status(400).json({
        //         status: "failed",
        //         message: "Invalid page number. No data available for the requested page.",
        //     });
        // }
        // query = query.skip(skip).limit(limit)
        const features = new APIFeatcher(Tour.find(), req.query).filter().sort().fildes().pagination()
        const data = await features.query;

        return res.status(200).json({
            status: "success",
            data: {
                data,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            data: "no data to show",
        });
    }
};


exports.getDataId = async (req, res) => {
    try {
        const data = await Tour.findById(req.params.id);
        return res.status(200).json({
            status: "success",
            data: {
                data,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            data: "no data to show",
        });
    }
};

exports.createData = async (req, res) => {
    try {

        const newData = await Tour.create(req.body);
        return res.status(201).json({
            status: "success",
            data: {
                data: newData,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            data: error,
        });
    }
};
// exports.createData2 = async (req, res, next) => {
//     const newData = new Tour(req.body);
//     try {
//         const addAll = await newData.save()
//         return res.status(201).json(addAll)
//     } catch (error) {
//         next(error)
//     }
// };

exports.deleteData = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        return res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            data: "no data to delete",
        });
    }
};

exports.updateData = async (req, res) => {
    try {
        const updatedData = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        return res.status(200).json({
            status: "success",
            data: {
                data: updatedData,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            data: "no data to update",
        });
    }
};


exports.aggregationPipeline = async (req, res,next) => {
    try {
        const aggregation = await Tour.aggregate([
            {
                $match: { price: { $gte: 100 } }
            },
            {
                $group: {
                    _id: null,
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            }
        ]);

        // Log the aggregation result to inspect
        console.log("Aggregation Result:", aggregation);

        // Check if the aggregation result is empty
        if (aggregation.length === 0) {
            return res.status(200).json({
                status: "success",
                message: "No data found matching the criteria.",
                data: {
                    data: aggregation,
                },
            });
        }

        return res.status(200).json({
            status: "success",
            data: {
                data: aggregation,
            },
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(400).json({
            status: "failed",
            data: "An error occurred while processing the data.",
        });
    }
};


exports.getAllMonth = async (req, res) => {
    try {
      const month = await Tour.aggregate([
        {
          $unwind: "$startDate" // Unwind the startDate array to create separate documents for each date
        },
        {
          $match: {
            startDate: {
              $gte: new Date("2021-01-01"), // Filter the documents with startDate in 2021
              $lt: new Date("2022-12-31")
            }
          }
        },
        {
          $group: {
            _id: { $month: "$startDate" }, // Group by the month of the startDate
            toursCount: { $sum: 1 }, // Count the number of tours in each group
            tourNames: { $push: "$name" }
          }
        },
        {
          $sort: { toursCount: -1 } // Sort the result in descending order based on the toursCount
        },
        {
          $limit: 1 // Get the busiest month
        }
      ]).exec(); // Execute the aggregation pipeline
  
      return res.status(200).json({
        status: "success",
        data: {
          data: month,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(400).json({
        status: "failed",
        data: "An error occurred while processing the data.",
      });
    }
  };
  