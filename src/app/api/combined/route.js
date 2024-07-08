import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month') || '';

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000/api';

  try {
    const [transactionsResponse, barChartResponse, pieChartResponse] = await Promise.all([
      axios.get(`${baseUrl}/transactions?month=${month}`),
      axios.get(`${baseUrl}/barchart?month=${month}`),
      axios.get(`${baseUrl}/piechart?month=${month}`),
    ]);

    const combinedData = {
      transactions: transactionsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
