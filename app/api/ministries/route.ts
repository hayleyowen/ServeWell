import { NextResponse } from 'next/server'
import { createMinistry } from '@/app/lib/data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received data:', body)

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
