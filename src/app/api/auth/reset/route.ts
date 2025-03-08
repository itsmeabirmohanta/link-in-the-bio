import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/crypto'

// In a real app, you would use a proper email service
async function sendResetEmail(email: string, resetToken: string) {
  console.log(`Reset email sent to ${email} with token ${resetToken}`)
  // Here you would integrate with a service like SendGrid, AWS SES, etc.
  // Example:
  // await sendGrid.send({
  //   to: email,
  //   subject: 'Reset Your Password',
  //   text: `Click here to reset your password: ${process.env.NEXT_PUBLIC_APP_URL}/auth/reset/${resetToken}`
  // })
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Check if email matches admin email
    if (email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      // Return success even if email doesn't match to prevent email enumeration
      return NextResponse.json({ 
        success: true,
        message: 'If this email is registered, you will receive reset instructions'
      })
    }

    // Generate a reset token (in a real app, store this in a database with expiration)
    const resetToken = encrypt(Date.now().toString())
    
    // Send reset email
    await sendResetEmail(email, resetToken)

    return NextResponse.json({ 
      success: true,
      message: 'If this email is registered, you will receive reset instructions'
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ 
      success: false,
      message: 'An error occurred while processing your request'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { token, newPassword } = await request.json()

    // In a real app, verify token from database and check expiration
    // For demo, we'll just check if token exists
    if (!token) {
      return NextResponse.json({ 
        success: false,
        message: 'Invalid or expired reset token'
      }, { status: 400 })
    }

    // Update password (in a real app, update in database)
    // For demo, we'll just show success
    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json({ 
      success: false,
      message: 'An error occurred while updating your password'
    }, { status: 500 })
  }
} 