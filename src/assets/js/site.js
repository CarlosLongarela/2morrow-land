document.documentElement.classList.add("js");

setupShareButtons();
setupRevealAnimations();

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

function announceStatus(node, message, isError) {
  if (!node) {
    return;
  }

  node.textContent = message;
  node.classList.toggle("is-error", isError);
  node.classList.toggle("is-success", !isError);
}
