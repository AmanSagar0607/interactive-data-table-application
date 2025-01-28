import { NextResponse } from "next/server"
import type { WebsiteData } from "@/types"

const SPREADSHEET_ID = "1vwc803C8MwWBMc7ntCre3zJ5xZtG881HKkxlIrwwxNs"
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A2:I?key=${API_KEY}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }

    const data = await response.json()
    const rows = data.values || []

    const formattedData: WebsiteData[] = rows.map((row: any[]) => ({
      domain: row[0] || "",
      niche1: row[1] || "",
      niche2: row[2] || "",
      traffic: row[3] || "",
      dr: Number.parseInt(row[4]) || 0,
      da: Number.parseInt(row[5]) || 0,
      language: row[6] || "",
      price: row[7] || "",
      spamScore: row[8] || "",
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to fetch data. Please try again later." }, { status: 500 })
  }
}

