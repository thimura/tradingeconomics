import { NextResponse } from 'next/server';
import axios from 'axios';

/**
 * Fetches data from the API. 
 *
 * @param {Request} req - Country to gather information on.
 * @returns {NextResponse} The JSON response containing the fetched data or an error message.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country');
  const indicator = searchParams.get('indicator');

  try {
    const api_key = process.env.API_KEY;
    const url = `https://api.tradingeconomics.com/historical/country/${country}/indicator/${indicator}?c=${api_key}&f=json`;

    const response = await axios.get(url);
    return NextResponse.json(response.data);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data from external API' }, { status: 500 });
  }
}
