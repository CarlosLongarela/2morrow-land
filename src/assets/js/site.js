const languageStorageKey = "2morrow-language-preference";

document.documentElement.classList.add("js");

setupLanguageSelectors();
setupShareButtons();
setupRevealAnimations();
setupNewsletterForms();

function setupLanguageSelectors() {
  const selectors = document.querySelectorAll("[data-language-selector]");
  if (!selectors.length) {
    return;
  }

  const storedLanguage = safeStorageGet(languageStorageKey);

  for (const selector of selectors) {
    selector.value = window.location.pathname;

    if (storedLanguage) {
      selector.dataset.preference = storedLanguage;
      selector.title = storedLanguage === "es" ? "Preferred language: Español" : "Preferred language: English";
    }

    selector.addEventListener("change", () => {
      const nextPath = selector.value;
      safeStorageSet(languageStorageKey, nextPath.startsWith("/es") ? "es" : "en");
      window.location.assign(nextPath);
    });
  }
}

function setupShareButtons() {
  const buttons = document.querySelectorAll("[data-share-button]");
  const status = document.querySelector("[data-share-status]");

  for (const button of buttons) {
    button.addEventListener("click", async () => {
      const shareUrl = button.dataset.shareUrl ?? window.location.href;
      const shareTitle = button.dataset.shareTitle ?? document.title;
      const shareText = button.dataset.shareText ?? "";
      const success = button.dataset.shareSuccess ?? "Link copied.";
      const fallbackMessage = button.dataset.shareFailure ?? shareUrl;

      try {
        if (navigator.share) {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
          });
          announceStatus(status, success, false);
          return;
        }

        await navigator.clipboard.writeText(shareUrl);
        announceStatus(status, success, false);
      } catch {
        announceStatus(status, fallbackMessage, true);
      }
    });
  }
}

function setupRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const item of items) {
      item.classList.add("is-visible");
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.15
    }
  );

  for (const item of items) {
    observer.observe(item);
  }
}

function setupNewsletterForms() {
  const forms = document.querySelectorAll("[data-newsletter-form]");

  for (const form of forms) {
    const status = form.querySelector("[data-form-status]");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearFieldMessages(form);

      const emailField = form.elements.namedItem("email");
      const privacyField = form.elements.namedItem("privacy");
      const honeypotField = form.elements.namedItem("company");

      if (honeypotField instanceof HTMLInputElement && honeypotField.value.trim()) {
        announceStatus(status, form.dataset.errorMessage ?? "Request blocked.", true);
        return;
      }

      if (emailField instanceof HTMLInputElement) {
        emailField.setCustomValidity("");
        if (!emailField.validity.valid) {
          emailField.setCustomValidity(form.dataset.emailError ?? "Enter a valid email address.");
          emailField.reportValidity();
          announceStatus(status, form.dataset.emailError ?? "Enter a valid email address.", true);
          return;
        }
      }

      if (privacyField instanceof HTMLInputElement && !privacyField.checked) {
        privacyField.setCustomValidity(form.dataset.consentError ?? "Consent required.");
        privacyField.reportValidity();
        announceStatus(status, form.dataset.consentError ?? "Consent required.", true);
        return;
      }

      if (privacyField instanceof HTMLInputElement) {
        privacyField.setCustomValidity("");
      }

      announceStatus(
        status,
        form.dataset.placeholderMessage ?? form.dataset.successMessage ?? "Submitted.",
        false
      );
    });
  }
}

function clearFieldMessages(form) {
  const emailField = form.elements.namedItem("email");
  const privacyField = form.elements.namedItem("privacy");

  if (emailField instanceof HTMLInputElement) {
    emailField.setCustomValidity("");
  }

  if (privacyField instanceof HTMLInputElement) {
    privacyField.setCustomValidity("");
  }
}

function announceStatus(node, message, isError) {
  if (!node) {
    return;
  }

  node.textContent = message;
  node.classList.toggle("is-error", isError);
  node.classList.toggle("is-success", !isError);
}

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return null;
  }
}
