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

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity },
  ];

  const results = await Promise.all(priceRanges.map(async ({ range, min, max }) => {
    const count = await ProductTransaction.countDocuments({
      ...dateFilter,
      price: { $gte: min, $lt: max === Infinity ? undefined : max }
    });
    return { range, count };
  }));

  return NextResponse.json(results);
}
