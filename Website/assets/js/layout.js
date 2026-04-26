const PARTIAL_FALLBACKS = {
  "partials/header.html": `
<header class="navbar">
  <div class="container nav-inner">
    <div class="nav-brand">
      <img src="assets/images/logo.svg" alt="MediRAG logo" class="nav-logo" />
      <span class="nav-brand-name">MediRAG</span>
    </div>
    <nav class="nav-links">
      <a class="nav-link" href="Home.html" data-nav="home">Home</a>
      <a class="nav-link" href="domain.html" data-nav="domain">Domain</a>
      <a class="nav-link" href="milestones.html" data-nav="milestones">Milestones</a>
      <a class="nav-link" href="documents.html" data-nav="documents">Documents</a>
      <a class="nav-link" href="presentations.html" data-nav="presentations">Presentations</a>
      <a class="nav-link" href="about.html" data-nav="about">About Us</a>
      <a class="nav-link" href="contact.html" data-nav="contact">Contact Us</a>
    </nav>
  </div>
</header>
`,
  "partials/footer.html": `
<footer>
  <div class="container">
    <p>MediRAG Academic Project Website</p>
  </div>
</footer>
`
};

async function injectPartial(targetId, partialPath) {
  const mount = document.getElementById(targetId);
  if (!mount) return;

  try {
    const response = await fetch(partialPath);
    if (!response.ok) throw new Error("Failed to load partial");
    mount.innerHTML = await response.text();
  } catch (error) {
    const fallback = PARTIAL_FALLBACKS[partialPath];
    if (fallback) {
      mount.innerHTML = fallback;
      return;
    }

    console.error(error);
  }
}

function highlightActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;

  const activeLink = document.querySelector(`.nav-link[data-nav="${page}"]`);
  if (activeLink) activeLink.classList.add("active");
}

async function initializeLayout() {
  await injectPartial("site-header", "partials/header.html");
  await injectPartial("site-footer", "partials/footer.html");
  highlightActiveNav();

  const header = document.querySelector(".navbar");
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeaderState = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const atTop = currentScrollY < 20;

    header.classList.toggle("is-scrolled", !atTop);
    header.classList.toggle("is-hidden", !atTop && scrollingDown && currentScrollY > 96);
    document.body.classList.toggle("header-hidden", !atTop && scrollingDown && currentScrollY > 96);

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    globalThis.requestAnimationFrame(updateHeaderState);
    ticking = true;
  }, { passive: true });

  updateHeaderState();
}

document.addEventListener("DOMContentLoaded", initializeLayout);
