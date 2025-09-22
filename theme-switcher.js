/**
 * ----------------------------------------------------------------
 * Theme Switcher Logic
 *
 * This script handles the logic for applying, saving, and updating
 * the light/dark/system theme for the entire application.
 *
 * It should be included on every page.
 * ----------------------------------------------------------------
 */
document.addEventListener("DOMContentLoaded", () => {
  // The key used to store the theme preference in localStorage.
  const THEME_KEY = "app-theme-preference";

  // Get the <html> element to set the `data-theme` attribute on.
  const htmlElement = document.documentElement;

  // Get the theme option buttons (this will only find them on the settings page).
  const themeOptions = document.querySelectorAll(".theme-option");

  /**
   * Applies the selected theme to the <html> element.
   * It handles the 'system' theme by checking the user's OS preference.
   * @param {string} theme - The theme to apply ('light', 'dark', or 'system').
   */
  const applyTheme = (theme) => {
    let effectiveTheme = theme;
    if (theme === "system") {
      // Check if the OS is in dark mode
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Set the data-theme attribute on the <html> tag
    htmlElement.setAttribute("data-theme", effectiveTheme);

    // If we are on the settings page, update the UI to show the active choice.
    // This check prevents errors on pages that don't have the theme options.
    if (themeOptions.length > 0) {
      themeOptions.forEach((option) => {
        if (option.dataset.themeOption === theme) {
          option.classList.add("active");
        } else {
          option.classList.remove("active");
        }
      });
    }
  };

  /**
   * Saves the user's theme preference to localStorage and applies it.
   * @param {string} theme - The theme to set ('light', 'dark', or 'system').
   */
  const setTheme = (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  };

  // --- EVENT LISTENERS ---

  // Add click listeners to each theme option button if they exist on the page.
  if (themeOptions.length > 0) {
    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const selectedTheme = option.dataset.themeOption;
        setTheme(selectedTheme);
      });
    });
  }

  // Listen for changes in the OS theme preference.
  // This is for when the user has 'system' selected and they change their OS theme.
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const savedTheme = localStorage.getItem(THEME_KEY) || "system";
      if (savedTheme === "system") {
        // Re-apply the system theme to reflect the change.
        applyTheme("system");
      }
    });

  // --- INITIALIZATION ---

  // On initial page load, get the saved theme from localStorage
  // or default to 'system', then apply it.
  const savedTheme = localStorage.getItem(THEME_KEY) || "system";
  applyTheme(savedTheme);
});
