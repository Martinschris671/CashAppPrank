// guard.js - The Bulletproof Subscription Sentry

// This script MUST run first on every protected page to be effective.

(function () {
  const currentUserEmail = localStorage.getItem("lastAppUser");

  if (!currentUserEmail) {
    // If no user is logged in, they should be on the authentication page.
    // We only redirect if they are NOT already on the auth page to prevent a loop.
    if (!window.location.pathname.includes("authentication.html")) {
      window.location.replace("authentication.html");
    }
    return;
  }

  // A user is logged in. Now, check their specific subscription status.
  const userSubData =
    JSON.parse(localStorage.getItem(`sub_${currentUserEmail}`)) || {};
  const { status, endDate: endDateString } = userSubData;

  let isExpired = true; // Assume expired by default for safety.

  if (
    status === "LIFETIME" ||
    (endDateString && new Date(endDateString).getTime() > Date.now())
  ) {
    isExpired = false;
  }

  // THE FINAL CHECK:
  if (isExpired) {
    // If the subscription is expired, the ONLY page they are allowed to see is the subscription page.
    // If they are on any other page, redirect them immediately.
    if (!window.location.pathname.includes("subscription.html")) {
      // `window.location.replace` is critical. It erases the browser history,
      // making it impossible to press "Back" on a phone to escape.
      window.location.replace("subscription.html");
    }
  }
})();
