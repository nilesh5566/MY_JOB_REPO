import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, name, stats, topJobs, tip } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
body{font-family:Arial,sans-serif;background:#f0f4ff;padding:0;margin:0}
.wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;margin-top:20px}
.header{background:linear-gradient(135deg,#0b1120,#0d1528);padding:32px;text-align:center;color:#fff}
.logo{font-size:24px;font-weight:900;color:#00dcff;margin-bottom:4px}
.subtitle{color:#8b9cbf;font-size:13px}
.body{padding:24px}
.stat-row{display:flex;gap:12px;margin:16px 0}
.stat{flex:1;background:#f0f4ff;border-radius:12px;padding:16px;text-align:center}
.stat-num{font-size:28px;font-weight:900;color:#0066cc}
.stat-label{font-size:11px;color:#4a5a7a;margin-top:4px}
.section-title{font-size:16px;font-weight:700;color:#111;margin:20px 0 12px}
.job-card{background:#f8faff;border:1px solid #dce3f5;border-radius:12px;padding:16px;margin-bottom:8px}
.job-title{font-weight:700;font-size:14px;color:#111}
.job-meta{font-size:12px;color:#4a5a7a;margin-top:4px}
.job-salary{font-size:12px;font-weight:700;color:#16a34a;margin-top:4px}
.tip-box{background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #fde68a;border-radius:12px;padding:16px;margin:16px 0}
.tip-text{font-size:13px;color:#92400e}
.cta{display:block;background:linear-gradient(135deg,#00dcff,#7c3aed);color:#000;font-weight:700;text-align:center;padding:16px;border-radius:12px;text-decoration:none;font-size:15px;margin:20px 0}
.footer{padding:16px 24px;background:#f8faff;text-align:center;font-size:11px;color:#8b9cbf}
</style></head><body>
<div class="wrap">
  <div class="header">
    <div class="logo">🚀 TalentLaunch</div>
    <div class="subtitle">Your weekly career digest · ${new Date().toLocaleDateString('en-IN',{dateStyle:'long'})}</div>
  </div>
  <div class="body">
    <p style="font-size:15px;color:#333">Hey ${name||'there'} 👋</p>
    <p style="font-size:13px;color:#4a5a7a">Here's your weekly TalentLaunch summary. Keep the momentum going!</p>
    
    <div class="stat-row">
      <div class="stat"><div class="stat-num">${stats?.applied||0}</div><div class="stat-label">Applied</div></div>
      <div class="stat"><div class="stat-num">${stats?.interview||0}</div><div class="stat-label">Interviews</div></div>
      <div class="stat"><div class="stat-num">${stats?.offer||0}</div><div class="stat-label">Offers 🎉</div></div>
      <div class="stat"><div class="stat-num">${stats?.xp||0}</div><div class="stat-label">XP Earned</div></div>
    </div>

    <div class="tip-box">
      <strong>💡 This week's tip:</strong><br>
      <span class="tip-text">${tip||'Apply Monday or Tuesday for 40% less competition!'}</span>
    </div>

    ${(topJobs||[]).length>0?`
    <div class="section-title">🔥 Top Jobs This Week</div>
    ${(topJobs||[]).slice(0,5).map((j:any)=>`
    <div class="job-card">
      <div class="job-title">${j.title}</div>
      <div class="job-meta">${j.company} · ${j.location}</div>
      <div class="job-salary">${j.estimatedSalary||'Competitive'}</div>
    </div>`).join('')}`:''}

    <a href="https://talentlaunch.app/dashboard" class="cta">Open TalentLaunch → Continue Your Journey</a>
    
    <p style="font-size:12px;color:#4a5a7a;text-align:center">You're on a mission. Keep applying, keep growing. 🚀</p>
  </div>
  <div class="footer">TalentLaunch · CS Career OS · <a href="#unsubscribe">Unsubscribe</a></div>
</div>
</body></html>`

    // In production, use Resend/SendGrid/Nodemailer
    // For now, return the HTML for preview
    return NextResponse.json({ 
      success: true, 
      message: `Digest prepared for ${email}`,
      html,
      note: 'To send real emails, add RESEND_API_KEY to .env.local and uncomment the Resend code'
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
