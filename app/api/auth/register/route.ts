import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = 'student', college = '', skills = [], targetRole = '' } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: 'Password must be 6+ characters' }, { status: 400 })
    if (!['student','recruiter','admin'].includes(role))
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

    await connectDB()
    if (await User.findOne({ email })) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const user = await User.create({ name, email, password, role, college, skills, targetRole })
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.NEXTAUTH_SECRET || 'secret',
      { expiresIn: '30d' }
    )
    return NextResponse.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, college: user.college, skills: user.skills, targetRole: user.targetRole, xp: 0 }
    })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
