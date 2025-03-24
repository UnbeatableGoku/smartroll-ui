import NewPassword from '@components/NewPassword/NewPassword'
import { useState, useEffect } from 'react';

const ForgotPassword = () => {
  const [profileSlug, setProfileSlug] = useState<string>("");
  const [forgotPasswordCode, setForgotPasswordCode] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // Use `window.location.search`
    const slug = params.get('profile_slug');
    const code = params.get('profile_forgot_password_code');
    if (slug && code) {
      setProfileSlug(slug);
      setForgotPasswordCode(code);
    }
  }, []);

  return (
    <>
      {profileSlug && forgotPasswordCode && (
        <NewPassword profile_slug={profileSlug} ForgotPasswordCode={forgotPasswordCode} isForgotPassword={true} />
      )}
    </>
  );
};

export default ForgotPassword;
