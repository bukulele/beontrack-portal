/**
 * Portal Sign-In Page
 *
 * Public page for applicants to sign in using email + OTP.
 * No password required - fully passwordless authentication.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

export default function PortalSignInPage() {
  const router = useRouter();
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Check if user exists
      const checkResponse = await fetch('/api/portal/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const checkData = await checkResponse.json();

      if (!checkData.exists) {
        // User doesn't exist - show error
        setError('No account found with this email. Please contact HR to get access.');
        setLoading(false);
        return;
      }

      // User exists - send OTP
      await sendOTP();
    } catch (err) {
      setError(err.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    // Use Better Auth client directly
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email: email.toLowerCase(),
      type: 'sign-in',
    });

    if (error) {
      throw new Error(error.message || 'Failed to send verification code');
    }

    // In development, fetch the OTP code
    if (process.env.NODE_ENV === 'development') {
      try {
        const otpResponse = await fetch('/api/portal/auth/get-dev-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase() }),
        });

        if (otpResponse.ok) {
          const otpData = await otpResponse.json();
          setSuccess(`Verification code sent! Use code: ${otpData.otp} (dev mode)`);
          setStep('otp');
          return;
        }
      } catch (otpErr) {
        console.error('Failed to fetch dev OTP:', otpErr);
      }
    }

    setSuccess('Verification code sent! Check your email.');
    setStep('otp');
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Verify OTP and create session using Better Auth
      const { data, error } = await authClient.signIn.emailOtp({
        email: email.toLowerCase(),
        otp: otp,
      });

      if (error) {
        throw new Error(error.message || 'Invalid verification code');
      }

      setSuccess('Verification successful! Redirecting...');

      // Redirect to application page
      setTimeout(() => {
        router.push('/portal/employees/application');
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('email');
    }
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Applicant Portal
          </CardTitle>
          <CardDescription className="text-center">
            {step === 'email' && 'Enter your email to receive a verification code'}
            {step === 'otp' && 'Enter the verification code sent to your email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email}
              >
                {loading ? 'Checking...' : 'Continue'}
              </Button>

              <div className="text-sm text-center text-muted-foreground">
                Don't have access yet? Contact HR to get started.
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={loading}
                  autoFocus
                  maxLength={6}
                />
                <p className="text-sm text-muted-foreground">
                  Code sent to: <strong>{email}</strong>
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </Button>
              </div>

              <Button
                type="button"
                variant="link"
                onClick={() => sendOTP()}
                disabled={loading}
                className="w-full text-sm"
              >
                Resend code
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
