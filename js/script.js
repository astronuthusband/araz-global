/* ================================================
   js/script.js
   ================================================ */




/* =========================================================
   ARAZ GLOBAL — MAIN SCRIPT
   ========================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileNav();
    initReveal();
    initFaq();
    initProjectFilter();
    initContactForm();
    initSmoothAnchors();
    initWhatsApp();
    initThemeToggle();
  });

  /* -------------------- Sticky header -------------------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var isHome = header.hasAttribute('data-overlay');

    function update() {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else if (isHome) {
        header.classList.remove('is-scrolled');
      }
    }
    if (!isHome) header.classList.add('is-solid');
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* -------------------- Mobile navigation -------------------- */
  function initMobileNav() {
    var toggle = document.querySelector('.hamburger');
    var nav = document.querySelector('.mobile-nav');
    if (!toggle || !nav) return;

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }
    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      document.body.classList.add('nav-open');
    }

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }



  /* -------------------- Scroll reveal -------------------- */
  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* -------------------- FAQ accordion -------------------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(function (i) {
          i.classList.remove('is-open');
          i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* -------------------- Project filtering -------------------- */
  function initProjectFilter() {
    var bar = document.querySelector('.filter-bar');
    var cards = document.querySelectorAll('[data-category]');
    if (!bar || !cards.length) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      bar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      var filter = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !match;
      });
    });
  }

  /* -------------------- Contact / enquiry form validation -------------------- */
function initContactForm() {
  var forms = document.querySelectorAll('[data-validate]');

  forms.forEach(function (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var valid = true;
      var fields = form.querySelectorAll('[required]');

      fields.forEach(function (field) {
        var wrap = field.closest('.form-field');
        var errorEl = wrap ? wrap.querySelector('.form-error') : null;
        var message = '';

        if (!field.value.trim()) {
          message = 'This field is required.';
        } else if (
          field.type === 'email' &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
        ) {
          message = 'Enter a valid email address.';
        } else if (
          field.type === 'tel' &&
          field.value.trim() &&
          !/^[0-9+\-\s()]{7,}$/.test(field.value.trim())
        ) {
          message = 'Enter a valid phone number.';
        }

        if (message) {
          valid = false;

          if (wrap) wrap.classList.add('has-error');
          if (errorEl) errorEl.textContent = message;
        } else {
          if (wrap) wrap.classList.remove('has-error');
          if (errorEl) errorEl.textContent = '';
        }
      });

      if (!valid) return;

      var status =
        form.parentElement.querySelector('.form-status') ||
        form.querySelector('.form-status');

      var submitButton = form.querySelector('button[type="submit"]');

      try {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';
        }

        var formData = new FormData(form);

        await fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(formData).toString()
        });

        form.reset();
        form.hidden = true;

        if (status) {
          status.classList.add('is-visible');
        }

      } catch (error) {
        console.error('Form submission error:', error);

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Enquiry';
        }

        if (status) {
          status.textContent =
            'Sorry, something went wrong. Please try again.';
          status.classList.add('is-visible');
        }
      }
    });
  });
}

  /* -------------------- WhatsApp floating button -------------------- */
function initWhatsApp() {
  var phoneNumber = '601112911929'; // TODO: replace with real number, no + or spaces
  var message = 'Hi Araz Global, I would like to enquire about your services.';

  var link = document.createElement('a');
  link.className = 'whatsapp-float';
  link.href = 'https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(message);
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', 'Chat with us on WhatsApp');
  link.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.2.2-.4.1-.1 0-.3 0-.4 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.4 3.9 3.4.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1Z" fill="#fff"/></svg>';

  document.body.appendChild(link);
}

  /* -------------------- Smooth same-page anchors -------------------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });
  }
})();

/* -------------------- Dark mode toggle -------------------- */
function initThemeToggle() {
  var saved = localStorage.getItem('araz-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  var toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', function () {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('araz-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('araz-theme', 'dark');
    }
  });
}

/* =========================================================
   ARAZ AI CHATBOT
   ========================================================= */

(function () {

    const chatbotHTML = `
        <div class="chatbot">

           <button
    class="chatbot-toggle"
    id="chatbotToggle"
    aria-label="Open Araz AI"
>
    <img
        src="assets/images/araz-global.png"
        alt=""
>
</button>

            <div
                class="chatbot-window"
                id="chatbotWindow"
            >

                <div class="chatbot-header">

                    <div>
                        <strong>Araz AI</strong>
                        <span>How can we help?</span>
                    </div>

                    <button
                        id="chatbotClose"
                        aria-label="Close chatbot"
                    >
                        ×
                    </button>

                </div>

                <div
                    class="chatbot-messages"
                    id="chatbotMessages"
                >

                    <div class="chatbot-message bot">Hi! 👋 I'm Araz AI. How can I help you with Araz Global?</div>

                </div>

                <form
                    class="chatbot-input"
                    id="chatbotForm"
                >

                    <input
                        type="text"
                        id="chatbotInput"
                        placeholder="Ask about our services..."
                        autocomplete="off"
                    >

                    <button type="submit">
                        Send
                    </button>

                </form>

            </div>

        </div>
    `;

    document.body.insertAdjacentHTML(
        "beforeend",
        chatbotHTML
    );


    /* -----------------------------------------------------
       ELEMENTS
       ----------------------------------------------------- */

    const chatbotToggle =
        document.getElementById("chatbotToggle");

    const chatbotWindow =
        document.getElementById("chatbotWindow");

    const chatbotClose =
        document.getElementById("chatbotClose");

    const chatbotForm =
        document.getElementById("chatbotForm");

    const chatbotInput =
        document.getElementById("chatbotInput");

    const chatbotMessages =
        document.getElementById("chatbotMessages");


    /* -----------------------------------------------------
       CHAT HISTORY
       ----------------------------------------------------- */

    let chatHistory = [];


    /* -----------------------------------------------------
       OPEN / CLOSE
       ----------------------------------------------------- */

    chatbotToggle.addEventListener("click", () => {

        chatbotWindow.classList.toggle("active");

        if (chatbotWindow.classList.contains("active")) {
            chatbotInput.focus();
        }

    });


    chatbotClose.addEventListener("click", () => {

        chatbotWindow.classList.remove("active");

    });


    /* -----------------------------------------------------
       ADD MESSAGE
       ----------------------------------------------------- */

   function addMessage(message, sender) {

    var messageElement = document.createElement('div');

    messageElement.classList.add(
        'chatbot-message',
        sender
    );

    messageElement.innerHTML = message
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

    chatbotMessages.appendChild(messageElement);

    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;

    return messageElement;
}


    /* -----------------------------------------------------
       SEND MESSAGE
       ----------------------------------------------------- */

    chatbotForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const message =
                chatbotInput.value.trim();

            if (!message) {
                return;
            }


            /* Add user message */

            addMessage(
                message,
                "user"
            );


            /* Clear input */

            chatbotInput.value = "";


            /* Save user message */

            chatHistory.push({
                role: "user",
                content: message
            });


            /* Show loading */

            const loadingMessage =
                addMessage(
                    "Thinking...",
                    "bot"
                );


            chatbotInput.disabled = true;


            try {

                const response =
                    await fetch(
                        "/api/chat",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                messages:
                                    chatHistory
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Something went wrong."
                    );

                }


                /* Replace Thinking... */

                loadingMessage.textContent =
                    data.reply;


                /* Save AI response */

                chatHistory.push({
                    role: "assistant",
                    content: data.reply
                });


            } catch (error) {

                console.error(
                    "Chatbot error:",
                    error
                );

                loadingMessage.textContent =
                    "Sorry, I'm having trouble connecting right now. Please try again.";

            }


            chatbotInput.disabled = false;

            chatbotInput.focus();

        }
    );

})();