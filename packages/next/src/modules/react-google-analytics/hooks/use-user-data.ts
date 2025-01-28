'use client';

import { isUndefined } from 'fmrs';
import { useMemo } from 'react';
import EMPTY_OBJECT from '../constants/empty-object.js';
import type GoogleAnalyticsUserDataAddress from '../types/google-analytics-user-data-address.js';
import type GoogleAnalyticsUserData from '../types/google-analytics-user-data.js';
import type UserData from '../types/user-data.js';

export default function useUserData(
  userData: UserData = EMPTY_OBJECT,
): GoogleAnalyticsUserData | undefined {
  const {
    address: userDataAddress = EMPTY_OBJECT,
    email,
    emailAddressSha256,
    phoneNumber,
    phoneNumberSha256,
  } = userData;

  const {
    city,
    country,
    firstName,
    firstNameSha256,
    lastName,
    lastNameSha256,
    postalCode,
    region,
    street,
  } = userDataAddress;

  // States
  const googleAnalyticsUserDataAddress:
    | GoogleAnalyticsUserDataAddress
    | undefined = useMemo((): GoogleAnalyticsUserDataAddress | undefined => {
    const newGoogleAnalyticsUserDataAddress: GoogleAnalyticsUserDataAddress = {
      city,
      country,
      first_name: firstName,
      last_name: lastName,
      postal_code: postalCode,
      region,
      sha256_first_name: firstNameSha256,
      sha256_last_name: lastNameSha256,
      street,
    };

    if (Object.values(newGoogleAnalyticsUserDataAddress).every(isUndefined)) {
      return;
    }

    return newGoogleAnalyticsUserDataAddress;
  }, [
    city,
    country,
    firstName,
    firstNameSha256,
    lastName,
    lastNameSha256,
    postalCode,
    region,
    street,
  ]);

  return useMemo((): GoogleAnalyticsUserData | undefined => {
    const newGoogleAnalyticsUserData: GoogleAnalyticsUserData = {
      address: googleAnalyticsUserDataAddress,
      email,
      phone_number: phoneNumber,
      sha256_email_address: emailAddressSha256,
      sha256_phone_number: phoneNumberSha256,
    };

    if (Object.values(newGoogleAnalyticsUserData).every(isUndefined)) {
      return;
    }

    return newGoogleAnalyticsUserData;
  }, [
    email,
    emailAddressSha256,
    googleAnalyticsUserDataAddress,
    phoneNumber,
    phoneNumberSha256,
  ]);
}
