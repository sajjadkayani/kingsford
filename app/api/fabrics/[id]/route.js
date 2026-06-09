import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Fabric from '../../../models/Fabric'

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const { name, image } = await request.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const fabric = await Fabric.findByIdAndUpdate(
      id,
      { name: name.trim(), image: image || '' },
      { new: true, runValidators: true }
    )
    if (!fabric) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ id: fabric._id.toString(), name: fabric.name, image: fabric.image })
  } catch (err) {
    if (err.code === 11000) return NextResponse.json({ error: 'A fabric with that name already exists' }, { status: 409 })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const fabric = await Fabric.findByIdAndDelete(id)
    if (!fabric) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
