import Sales from "../Models/salesSchema.js";
import Product from "../Models/productSchema.js";
export const savesalesData = async (req, res) => {
  const { price, quantity, category, customerID, productID,tagname } = req.body;
  console.log(price, quantity, category, customerID, productID,tagname);
  try {
    const newData = new Sales({
      price,
      quantity,
      category,
      customerID,
      productID,
      tagname
    });
    await newData.save();
    res.status(200).json({ message: "Data saved Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server error in saving sales data" });
  }
};

export const salesData = async (req, res) => {
  try {
    const currentDate = new Date();

    const sevenDaysAgo = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastSevenDays = await Sales.find({
      createdAt: {
        $lte: currentDate.toISOString().split("T")[0],
        $gte: sevenDaysAgo.toISOString().split("T")[0],
      },
    });
    const lastMonth = await Sales.find({
      createdAt: {
        $lte: currentDate.toISOString().split("T")[0],
        $gte: oneMonthAgo.toISOString().split("T")[0],
      },
    });

    const topSellingProducts = await Sales.aggregate([
       
      {
        $group: {
          _id: "$productID",
          totalRevenue: { $sum: "$price" },
          tagname: { $first: "$tagname" }
        },
      },
      
      
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 2,
      }
      
      
    ]);
    console.log(topSellingProducts)

    const worstPerforming = await Sales.aggregate([
      {
        $group: {
          _id: "$productID",
          totalRevenue: { $sum: "$price" },
          tagname: { $first: "$tagname" }
        },
      },
      {
        $sort: { totalRevenue: +1 },
      },
      {
        $limit: 2,
      },
    ]);

    const totalSales = await Sales.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);
    const totalSalesitems = await Sales.aggregate([
      {
        $group: {
          _id: "$productID",
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    const categorySales = await Sales.aggregate([
      {
        $group: {
          _id: "$category",
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    res
      .status(200)
      .json({
        lastSevenDays: lastSevenDays,
        lastMonth: lastMonth,
        topSellingProducts: topSellingProducts,
        totalSales: totalSales,
        worstPerforming: worstPerforming,
        totalSalesitems: totalSalesitems,
        categorySales:categorySales
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in fetching sales data" });
  }
};


export const productDetails = async(req,res)=>{
  try {
    const products = await Product.find({}, { tagname: true, id: true })
    res.status(200).json({result:products})
  } catch (error) {
    res.status(500).json({message:"Internal server error in product fetching for dashboard"})
  }
}