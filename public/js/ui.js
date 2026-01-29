document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  if (!toggle) return; // prevents error if button not found

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  }

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
});


  const counters = document.querySelectorAll("[data-counter]");
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-counter");
    let count = 0;
    const step = Math.ceil(target / 100);
    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        counter.textContent = target;
        clearInterval(interval);
      } else {
        counter.textContent = count;
      }
    }, 15);
  });

