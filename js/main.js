/* ==========================================
   DRA. SILVIA PÉREZ ÁLVAREZ
   JavaScript Funcionalidad
========================================== */

// ==================== EFECTO SCROLL EN HEADER ====================
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ==================== MENÚ MÓVIL (HAMBURGUESA) ====================
(function () {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (!navToggle || !navMenu) return;

  function closeMenu() {
    navToggle.classList.remove('is-active');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();
// ==================== VALIDACIÓN Y ENVÍO DE FORMULARIO (EmailJS) ====================
// Claves de EmailJS (emailjs.com) — gratis hasta 200 emails/mes
const EMAILJS_PUBLIC_KEY = 'kLFGQaG0OsFSiMEfl';
const EMAILJS_SERVICE_ID = 'service_0w9lz0r';
const EMAILJS_TEMPLATE_ID = 'template_2e0jado';

if (window.emailjs) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const formulario = document.getElementById('formularioContacto');

if (formulario) {
  formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const tipo = document.getElementById('tipo').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !tipo || !mensaje) {
      mostrarMensaje('Por favor completa todos los campos obligatorios.', 'error');
      return;
    }

    if (!validarEmail(email)) {
      mostrarMensaje('Por favor ingresa un email válido.', 'error');
      return;
    }

    // La plantilla de EmailJS solo tiene {{name}} y {{message}}, así que
    // metemos todos los datos del formulario dentro de "message".
    const mensajeCompleto =
      'Email: ' + email + '\n' +
      'Teléfono: ' + (telefono || '(no indicado)') + '\n' +
      'Tipo de caso: ' + tipo + '\n\n' +
      'Mensaje:\n' + mensaje;

    // Enlace para que el cliente cree su cuenta desde el email de confirmación,
    // ya con los datos de su solicitud incluidos (sin tener que rellenarlos otra vez).
    const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
    const crearCuentaLink = baseUrl + 'crear-cuenta.html'
      + '?nombre=' + encodeURIComponent(nombre)
      + '&email=' + encodeURIComponent(email)
      + '&telefono=' + encodeURIComponent(telefono)
      + '&tipo=' + encodeURIComponent(tipo)
      + '&mensaje=' + encodeURIComponent(mensaje);

    const submitBtn = formulario.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      name: nombre,
      email: email,
      message: mensajeCompleto,
      crear_cuenta_link: crearCuentaLink
    }).then(function () {
      mostrarMensaje('✓ Solicitud enviada correctamente. Revisa tu email: te hemos enviado un enlace para crear tu cuenta y seguir tu caso.', 'success');
      formulario.reset();
    }).catch(function (err) {
      console.error('Error enviando el formulario con EmailJS:', err);
      mostrarMensaje('No se pudo enviar el formulario. Inténtalo de nuevo o escríbenos directamente por email.', 'error');
    }).finally(function () {
      if (submitBtn) submitBtn.disabled = false;
    });

    // Guardamos también una copia local como respaldo (no sustituye el email)
    guardarSolicitud({
      nombre, email, telefono, tipo, mensaje,
      fecha: new Date().toLocaleString('es-ES')
    });
  });
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function guardarSolicitud(datos) {
  let solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
  solicitudes.push(datos);
  localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
  console.log('Solicitud guardada:', datos);
}

function mostrarMensaje(texto, tipo) {
  const mensaje = document.createElement('div');
  mensaje.className = `mensaje mensaje-${tipo}`;
  mensaje.innerHTML = texto;

  mensaje.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: ${tipo === 'success' ? '#365548' : '#d32f2f'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    z-index: 2000;
    animation: slideDown 0.3s ease;
  `;

  document.body.appendChild(mensaje);

  setTimeout(() => {
    mensaje.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => mensaje.remove(), 300);
  }, 4000);
}

function enviarPorWhatsApp(nombre, email, telefono, tipo, mensaje) {
  const numeroWhatsApp = '34609460452';
  const textoWhatsApp = `Hola, me gustaría solicitar una valoración pericial.%0A%0A` +
    `*Nombre:* ${nombre}%0A` +
    `*Email:* ${email}%0A` +
    `*Teléfono:* ${telefono}%0A` +
    `*Tipo de caso:* ${tipo}%0A%0A` +
    `*Detalles:*%0A${mensaje}`;

  // window.open(`https://wa.me/${numeroWhatsApp}?text=${textoWhatsApp}`, '_blank');
}

// ==================== ANCLAS SUAVE ====================
document.querySelectorAll('a[href^="#"]').forEach(enlace => {
  enlace.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================== ANIMACIÓN ENTRADA DE ELEMENTOS ====================
const observador = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
      observador.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.servicio-card, .step, .about-content').forEach(el => {
  observador.observe(el);
});

const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(0); opacity: 1; }
    to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
  }
  @keyframes fadeInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(style);

function cargarSolicitudes() {
  const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
  console.log('Solicitudes guardadas:', solicitudes);
  return solicitudes;
}

function limpiarSolicitudes() {
  localStorage.removeItem('solicitudes');
  console.log('Solicitudes eliminadas');
}

function exportarSolicitudes() {
  const solicitudes = cargarSolicitudes();
  const json = JSON.stringify(solicitudes, null, 2);
  console.log(json);
}

// ==================== CHATBOT FAQ + IA ====================
(function () {
  const faqs = [
    {
      q: '¿Cómo puedo solicitar una valoración pericial?',
      a: 'Completa el formulario de contacto indicando el tipo de caso y una breve descripción, o escríbenos por email o teléfono. Te responderemos lo antes posible para concertar la evaluación.'
    },
    {
      q: '¿Cuánto tiempo tarda en elaborarse un informe pericial?',
      a: 'Depende de la complejidad del caso, pero habitualmente entre 2 y 4 semanas desde la evaluación clínica hasta la entrega del informe firmado.'
    },
    {
      q: '¿Qué documentación debo aportar?',
      a: 'Informes médicos previos, pruebas complementarias (radiografías, resonancias, analíticas...) y, si lo hay, el informe pericial de la otra parte o el expediente judicial relacionado.'
    },
    {
      q: '¿Atienden casos fuera de Madrid?',
      a: 'Depende del caso. La evaluación clínica presencial se realiza en Madrid, pero los contrainformes y segundas valoraciones documentales podrían gestionarse a distancia.'
    },
    {
      q: '¿El proceso es confidencial?',
      a: 'Sí, toda la información se trata con estricta confidencialidad conforme a la normativa de protección de datos vigente.'
    },
    {
      q: '¿Cuáles son los honorarios?',
      a: 'Varían según el tipo de informe y su complejidad. Tras conocer el caso, se entrega un presupuesto cerrado antes de iniciar cualquier trabajo.'
    },
    {
      q: '¿Qué tipos de casos valoran?',
      a: 'Daño corporal, incapacidad, dependencia, responsabilidad civil, medicina física y contrainformes (ver sección <a href="#servicios" data-chat-link>Servicios</a> más arriba).'
    },
    {
      q: '¿El informe sirve para un procedimiento judicial?',
      a: 'Sí, son informes médico-periciales con validez para procedimientos judiciales, elaborados conforme a protocolos y baremos vigentes.'
    }
  ];

  const chatbot = document.querySelector('.chatbot');
  if (!chatbot) return;

  const toggle = document.getElementById('chatbotToggle');
  const closeBtn = document.getElementById('chatbotClose');
  const messagesEl = document.getElementById('chatbotMessages');
  const quickRepliesEl = document.getElementById('chatbotQuickReplies');
  const faqToggleBtn = document.getElementById('chatbotFaqToggle');
  const form = document.getElementById('chatbotForm');
  const input = document.getElementById('chatbotInput');
  const sendBtn = form ? form.querySelector('button[type="submit"]') : null;

  let greeted = false;
  let isWaiting = false;
  let aiAvailable = false;
  // Historial de la conversación (para dar contexto a la IA). Solo vive en memoria
  // mientras la pestaña está abierta; no se guarda en ningún sitio.
  const history = [];

  // Comprueba si el backend de IA (/api/chat) está desplegado y configurado.
  // Si no lo está (por ejemplo, en una vista previa sin servidor, o si la web
  // todavía no se ha conectado a la IA), el campo de texto libre se mantiene
  // oculto y solo se muestran las preguntas frecuentes.
  function checkAIAvailability() {
    return fetch('/api/chat', { method: 'GET' })
      .then(function (response) {
        if (!response.ok) return false;
        return response.json().then(function (data) {
          return data && data.status === 'ok';
        });
      })
      .catch(function () {
        return false;
      })
      .then(function (available) {
        aiAvailable = available;
        if (available && form) {
          form.classList.add('is-active');
        }
        return available;
      });
  }

  const aiCheckPromise = checkAIAvailability();

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addBubble(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + sender;
    bubble.innerHTML = text;
    messagesEl.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function addTypingIndicator() {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot chat-typing';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function setWaiting(waiting) {
    isWaiting = waiting;
    if (input) input.disabled = waiting;
    if (sendBtn) sendBtn.disabled = waiting;
  }

  function showQuickReplies() {
    quickRepliesEl.style.display = 'flex';
    faqToggleBtn.textContent = 'Ocultar preguntas frecuentes';
    scrollToBottom();
  }

  function hideQuickReplies() {
    quickRepliesEl.style.display = 'none';
    faqToggleBtn.textContent = 'Ver preguntas frecuentes';
  }

  function renderQuickReplies() {
    quickRepliesEl.innerHTML = '';
    faqs.forEach(function (faq) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quick-reply-btn';
      btn.textContent = faq.q;
      btn.addEventListener('click', function () {
        if (isWaiting) return;
        addBubble(faq.q, 'user');
        history.push({ role: 'user', content: faq.q });
        hideQuickReplies();
        setTimeout(function () {
          addBubble(faq.a, 'bot');
          history.push({ role: 'assistant', content: faq.a });
        }, 250);
      });
      quickRepliesEl.appendChild(btn);
    });
  }

  // Llama a nuestra función serverless (/api/chat), que a su vez llama a la
  // API de Claude con la clave guardada en el servidor. Si la función no
  // existe todavía (por ejemplo en local sin backend desplegado), cae en un
  // mensaje de respaldo en vez de romperse.
  async function askAI(message) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });

    if (!response.ok) {
      throw new Error('Respuesta no válida del servidor (' + response.status + ')');
    }

    const data = await response.json();
    if (!data.reply) {
      throw new Error('Respuesta vacía del servidor');
    }
    return data.reply;
  }

  function openChat() {
    chatbot.classList.add('is-open');
    if (!greeted) {
      greeted = true;
      aiCheckPromise.then(function (available) {
        const greeting = available
          ? '¡Hola! Soy el asistente virtual de la Dra. Pérez Álvarez. Puedes elegir una pregunta frecuente o escribir la tuya.'
          : '¡Hola! Soy el asistente virtual de la Dra. Pérez Álvarez. De momento puedo ayudarte con estas preguntas frecuentes:';
        addBubble(greeting, 'bot');
        renderQuickReplies();
        faqToggleBtn.style.display = 'block';
        showQuickReplies();
      });
    }
    setTimeout(function () { if (input && aiAvailable) input.focus(); }, 200);
  }

  function closeChat() {
    chatbot.classList.remove('is-open');
  }

  toggle.addEventListener('click', function () {
    if (chatbot.classList.contains('is-open')) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn.addEventListener('click', closeChat);

  faqToggleBtn.addEventListener('click', function () {
    if (quickRepliesEl.style.display === 'none') {
      showQuickReplies();
    } else {
      hideQuickReplies();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (isWaiting || !aiAvailable) return;

    const text = input.value.trim();
    if (!text) return;

    addBubble(text, 'user');
    history.push({ role: 'user', content: text });
    input.value = '';
    hideQuickReplies();
    setWaiting(true);

    const typingBubble = addTypingIndicator();

    askAI(text)
      .then(function (reply) {
        typingBubble.remove();
        addBubble(reply, 'bot');
        history.push({ role: 'assistant', content: reply });
      })
      .catch(function (err) {
        console.error('Chatbot IA error:', err);
        typingBubble.remove();
        addBubble('Ahora mismo no puedo conectar con el asistente. Completa el <a href="#contacto" data-chat-link>formulario de contacto</a> y te responderemos lo antes posible.', 'bot');
      })
      .finally(function () {
        setWaiting(false);
        input.focus();
      });
  });

  messagesEl.addEventListener('click', function (e) {
    if (e.target.matches('a[data-chat-link]')) {
      closeChat();
    }
  });
})();
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {

    reveals.forEach(el => {

        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 120;

        if (revealTop < windowHeight - revealPoint) {
            el.classList.add("active");
        }

    });

}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
