const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function syncHeader() {
  header.classList.toggle('scrolled', window.scrollY > 24);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

nav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('button');

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.removeAttribute('src');
  document.body.classList.remove('no-scroll');
}

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.querySelector('img').alt;
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    lightboxClose.focus();
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

const form = document.querySelector('#lead-form');
const formStatus = form.querySelector('.form-status');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  formStatus.textContent = 'Đang gửi thông tin...';

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' }
  })
    .then((response) => {
      if (!response.ok) throw new Error('Không thể gửi biểu mẫu');
      form.reset();
      formStatus.textContent = 'Đã gửi thành công. Chuyên viên sẽ liên hệ với bạn sớm.';
    })
    .catch(() => {
      formStatus.textContent = 'Chưa thể gửi lúc này. Vui lòng gọi Hotline 0945 698 801.';
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});
