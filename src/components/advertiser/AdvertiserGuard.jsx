import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdvertiser } from "../../context/AdvertiserContext";

/**
 * AdvertiserGuard
 * Wraps any route in the AD-creation flow (Goal -> Format -> ... -> Payment).
 * Enforces TWO mandatory pre-conditions:
 *  1. Must be OTP-authenticated via the dedicated 6-digit advertiser phone/OTP flow.
 *  2. Must have a COMPLETE business profile:
 *       - businessName non-empty
 *       - idNumberRaw exactly 12 digits (Aadhaar verified via LocationTax screen)
 *
 * Redirects:
 *  - Not authenticated                     -> /advertise/intro
 *  - Authenticated but incomplete profile  -> /advertise/business-profile
 *
 * NOTE: Checking idNumberRaw prevents the ProfileScreen Business tab (which uses
 * a 4-digit OTP) from bypassing Aadhaar KYC and setting isBusinessProfileSaved=true
 * without actual identity verification.
 */
export default function AdvertiserGuard({ children }) {
  const navigate = useNavigate();
  const { advertiserAuth, isBusinessProfileSaved, businessProfile } = useAdvertiser();

  const isAuthenticated =
    advertiserAuth?.isAuthenticated && advertiserAuth?.otpVerified;

  // Profile is only complete when Aadhaar (idNumberRaw) is exactly 12 digits
  const isProfileComplete =
    isBusinessProfileSaved &&
    businessProfile?.businessName?.trim().length > 0 &&
    businessProfile?.idNumberRaw?.length === 12;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/advertise/intro", { replace: true });
    } else if (!isProfileComplete) {
      navigate("/advertise/business-profile", { replace: true });
    }
  }, [isAuthenticated, isProfileComplete, navigate]);

  if (!isAuthenticated || !isProfileComplete) {
    return null;
  }

  return children;
}

