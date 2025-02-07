import { NextResponse } from 'next/server'
import { createMinistry, getMinistries } from '@/app/lib/data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received data:', body)

    const { MinistryName, Church_ID, Budget, description } = body;

    const ministry = await createMinistry(body)
    console.log('Created ministry:', ministry)

    return NextResponse.json({ 
      success: true, 
      message: 'Ministry created successfully',
      ministry
    })

  } catch (error) {
    console.error('Detailed error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create ministry',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const ministries = await getMinistries()
    return NextResponse.json(ministries)
  } catch (error) {
    console.error('Error fetching ministries:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch ministries',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
