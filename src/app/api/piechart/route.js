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

  const results = await ProductTransaction.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { _id: 0, category: '$_id', count: 1 } }
  ]);

  return NextResponse.json(results);
}
