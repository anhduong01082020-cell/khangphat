(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var navigation = document.getElementById("primary-nav");
  var form = document.getElementById("lead-form");
  var status = document.getElementById("form-status");
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

  function fieldValue(data, name, fallback) {
    var value = String(data.get(name) || "").trim();
    return value || fallback;
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        status.textContent = "Vui lòng hoàn thiện các trường bắt buộc.";
        return;
      }

      var data = new FormData(form);
      var recipient = form.getAttribute("data-recipient");
      var subject = "Đăng ký tư vấn Khang Phát Century - " + fieldValue(data, "fullName", "Khách hàng");
      var body = [
        "PHIẾU ĐĂNG KÝ TƯ VẤN KHANG PHÁT CENTURY",
        "",
        "Họ và tên: " + fieldValue(data, "fullName", "Chưa cung cấp"),
        "Số điện thoại: " + fieldValue(data, "phone", "Chưa cung cấp"),
        "Email: " + fieldValue(data, "email", "Chưa cung cấp"),
        "Tỉnh/Thành: " + fieldValue(data, "location", "Chưa cung cấp"),
        "Sản phẩm quan tâm: " + fieldValue(data, "product", "Chưa chọn"),
        "Mục đích: " + fieldValue(data, "purpose", "Chưa chọn"),
        "Ngân sách dự kiến: " + fieldValue(data, "budget", "Chưa chọn"),
        "Thời gian liên hệ: " + fieldValue(data, "contactTime", "Bất kỳ thời gian nào"),
        "",
        "Nội dung cần hỗ trợ:",
        fieldValue(data, "message", "Không có nội dung bổ sung"),
        "",
        "Khách hàng đã đồng ý để đơn vị tư vấn liên hệ theo nội dung đăng ký."
      ].join("\n");

      var gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(recipient) + "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var mailtoUrl = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var popup = window.open("about:blank", "_blank");

      if (popup) {
        try {
          popup.opener = null;
        } catch (error) {
          /* Một số trình duyệt không cho thay đổi opener; không ảnh hưởng việc soạn email. */
        }
        popup.location.href = gmailUrl;
        status.textContent = "Email đăng ký đã được soạn sẵn. Quý khách vui lòng kiểm tra và bấm Gửi.";
      } else {
        window.location.href = mailtoUrl;
        status.textContent = "Đang mở ứng dụng email để hoàn tất đăng ký.";
      }
    });
  }

  var year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
