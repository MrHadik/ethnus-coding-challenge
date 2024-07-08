import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import ProductTransaction from '../../../models/product';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');

  let dateFilter = {};
  if (month) {
    const startDate = new Date(`${month} 1, 2022`); // Using 2020 as a placeholder year
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    dateFilter = { dateOfSale: { $gte: startDate, $lt: endDate } };
  }

  const totalSaleAmount = await ProductTransaction.aggregate([
    { $match: { ...dateFilter, sold: true } },
    { $group: { _id: null, total: { $sum: '$price' } } }
  ]);

  const totalSoldItems = await ProductTransaction.countDocuments({
    ...dateFilter,
    sold: true
  });

  const totalNotSoldItems = await ProductTransaction.countDocuments({
    ...dateFilter,
    sold: false
  });

  return NextResponse.json({
    totalSaleAmount: totalSaleAmount[0] ? totalSaleAmount[0].total : 0,
    totalSoldItems,
    totalNotSoldItems,
  });
}
