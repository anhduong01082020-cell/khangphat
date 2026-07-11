(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var navigation = document.getElementById("primary-nav");
  var form = document.getElementById("lead-form");
  var lightbox = document.getElementById("lightbox");

  function setHeaderState() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
  }

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Mở menu");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Mở menu" : "Đóng menu");
      navigation.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -7%", threshold: 0.08 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  if (lightbox && typeof lightbox.showModal === "function") {
    var lightboxImage = lightbox.querySelector("img");
    var lightboxCaption = lightbox.querySelector("p");
    var lightboxClose = lightbox.querySelector(".lightbox__close");

    document.querySelectorAll("[data-lightbox]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        lightboxImage.src = trigger.getAttribute("data-lightbox");
        lightboxImage.alt = trigger.getAttribute("data-caption") || "Hình ảnh Khang Phát Century";
        lightboxCaption.textContent = trigger.getAttribute("data-caption") || "";
        lightbox.showModal();
      });
    });

    lightboxClose.addEventListener("click", function () {
      lightbox.close();
    });

    lightbox.addEventListener("click", function (event) {
      var rect = lightbox.getBoundingClientRect();
      var inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) lightbox.close();
    });
  }

  if (form) {
    var nextPage = form.querySelector('input[name="_next"]');
    if (nextPage) {
      nextPage.value = new URL("cam-on.html", window.location.href).href;
    }
  }

  var year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
