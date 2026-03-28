import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 })

    await connectDB()
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password)))
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.NEXTAUTH_SECRET || 'secret',
      { expiresIn: '30d' }
    )
    return NextResponse.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, college: user.college, skills: user.skills, targetRole: user.targetRole, xp: user.xp }
    })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
