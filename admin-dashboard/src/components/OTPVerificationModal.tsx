import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OTPVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  purpose?: 'signup' | 'login' | 'forgot-password';
}

export function OTPVerificationModal({
  open,
  onOpenChange,
  email,
  onVerify,
  onResend,
  purpose = 'signup'
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open, timer]);

  useEffect(() => {
    if (open) {
      inputRefs.current[0]?.focus();
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete OTP');
      return;
    }

    setIsVerifying(true);
    try {
      await onVerify(otpString);
      toast.success('OTP verified successfully!');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    if (!canResend) return;
    
    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
    onResend();
    toast.success('OTP sent successfully!');
    inputRefs.current[0]?.focus();
  };

  const getPurposeText = () => {
    switch (purpose) {
      case 'signup':
        return 'Complete your signup';
      case 'login':
        return 'Verify your login';
      case 'forgot-password':
        return 'Reset your password';
      default:
        return 'Verify your identity';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <DialogTitle className="text-center">Email Verification</DialogTitle>
          <DialogDescription className="text-center">
            {getPurposeText()}. We've sent a 6-digit code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* OTP Input */}
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-14 w-12 text-center text-lg font-semibold"
              />
            ))}
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {canResend ? (
              <span className="text-foreground">You can resend the code now</span>
            ) : (
              <span>Resend code in {timer}s</span>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={otp.some(d => !d) || isVerifying}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verify OTP
              </>
            )}
          </Button>

          {/* Resend Button */}
          <div className="text-center">
            <button
              onClick={handleResendOTP}
              disabled={!canResend}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              Didn't receive the code? Resend OTP
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
