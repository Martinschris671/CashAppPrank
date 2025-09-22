/**
 * balance.js
 * ----------
 * An ultra-functional, standalone script for contact-pay.html.
 * It handles the critical pre-payment balance check and manages the custom alert modal.
 * This script is designed to be clean, portable, and error-free.
 */

"use strict";

// This function will run immediately after the script is loaded.
(function () {
  // --- DOM Element Selectors ---
  // We wait for DOMContentLoaded to ensure these elements exist before we try to use them.
  let payBtn, alertModalOverlay, alertTitle, alertMessage, alertOkBtn;

  // --- localStorage Keys (for consistency) ---
  const balanceStorageKey = "cashAppBalance";
  const paymentAmountKey = "paymentAmount";
  const selectedContactIdKey = "selectedContactId";

  /**
   * Shows the custom alert modal with a specific title and message.
   * @param {string} title - The title to display in the alert (e.g., "Insufficient Funds").
   * @param {string} message - The main message of the alert.
   */
  function showAlert(title, message) {
    if (!alertModalOverlay || !alertTitle || !alertMessage) return; // Safety check
    alertTitle.textContent = title;
    alertMessage.textContent = message;
    alertModalOverlay.classList.add("show");
  }

  /**
   * Hides the custom alert modal.
   */
  function hideAlert() {
    if (!alertModalOverlay) return; // Safety check
    alertModalOverlay.classList.remove("show");
  }

  /**
   * This is the core function that runs when the "Pay" button is clicked.
   */
  function handlePayButtonClick() {
    // 1. Get the current user's balance and the amount they want to pay.
    const cashBalance = parseFloat(
      localStorage.getItem(balanceStorageKey) || "0"
    );
    const paymentAmount = parseFloat(
      localStorage.getItem(paymentAmountKey) || "0"
    );
    const selectedContactId = localStorage.getItem(selectedContactIdKey); // We just need to know if it exists.

    // 2. Check if a contact has been selected on the previous page.
    if (!selectedContactId) {
      showAlert("No Recipient", "Please select a contact to send money to.");
      return;
    }

    // 3. THE CRITICAL CHECK: Compare the payment amount to the user's balance.
    if (paymentAmount > cashBalance) {
      // If they don't have enough money, show the insufficient funds alert.
      showAlert(
        "Insufficient Funds",
        "Your cash balance is too low to complete this payment."
      );
      return;
    }

    // 4. If all checks pass, it's safe to proceed to the PIN page.
    window.location.href = "pin.html";
  }

  /**
   * This function runs once the entire HTML page is loaded.
   * It finds all the necessary elements and attaches the event listeners.
   */
  function initialize() {
    // Assign elements to our variables
    payBtn = document.getElementById("cp-pay-btn");
    alertModalOverlay = document.getElementById("alert-modal-overlay");
    alertTitle = document.getElementById("alert-title");
    alertMessage = document.getElementById("alert-message");
    alertOkBtn = document.getElementById("alert-ok-btn");

    // CRITICAL: If any required element is missing, stop the script to prevent errors.
    if (!payBtn || !alertModalOverlay || !alertOkBtn) {
      console.error(
        "Balance script could not find all required elements on the page."
      );
      return;
    }

    // Attach all event listeners
    payBtn.addEventListener("click", handlePayButtonClick);
    alertOkBtn.addEventListener("click", hideAlert);
    alertModalOverlay.addEventListener("click", (e) => {
      if (e.target === alertModalOverlay) {
        hideAlert();
      }
    });
  }

  // Wait for the DOM to be fully loaded before running the initialization logic.
  document.addEventListener("DOMContentLoaded", initialize);
})();
