import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import ProductTransaction from '../../../models/product';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const perPage = parseInt(searchParams.get('perPage')) || 10;
  const search = searchParams.get('search') || '';
  const month = searchParams.get('month');

  let query = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          // { price: { $regex: search, $options: 'i' } }, // Commented out as price is a number
        ],
      }
    : {};

  if (month) {
    const startDate = new Date(`${month} 1, 2022`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    query = {
      ...query,
      dateOfSale: { $gte: startDate, $lt: endDate },
    };
  }

  const transactions = await ProductTransaction.find(query)
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalTransactions = await ProductTransaction.countDocuments(query);

  return NextResponse.json({
    transactions,
    pagination: {
      total: totalTransactions,
      page,
      perPage,
      totalPages: Math.ceil(totalTransactions / perPage),
    },
  });
}
