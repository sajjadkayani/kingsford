import { NextResponse } from 'next/server'
import connectDB from '../../lib/mongodb'
import Fabric from '../../models/Fabric'

export async function GET() {
  try {
    await connectDB()
    const fabrics = await Fabric.find().sort({ name: 1 }).lean()
    return NextResponse.json(
      fabrics.map(f => ({ id: f._id.toString(), name: f.name, image: f.image || '' }))
    )
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const { name, image } = await request.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const fabric = await Fabric.create({ name: name.trim(), image: image || '' })
    return NextResponse.json({ id: fabric._id.toString(), name: fabric.name, image: fabric.image }, { status: 201 })
  } catch (err) {
    if (err.code === 11000) return NextResponse.json({ error: 'A fabric with that name already exists' }, { status: 409 })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
