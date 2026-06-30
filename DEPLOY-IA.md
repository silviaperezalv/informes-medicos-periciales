# Dra. Silvia Pérez Álvarez — Landing page con chatbot IA (nivel gratuito)

## Estructura del proyecto

```
index.html
css/styles.css
js/main.js
img/
api/chat.js        ← función serverless (backend) que habla con la IA
```

## Antes de nada: lee esto sobre el coste

Este proyecto usa la **API de Gemini de Google (Google AI Studio)** porque,
a diferencia de otros proveedores, ofrece un **nivel gratuito real** (no solo
un crédito de prueba que se agota), pensado para proyectos pequeños como un
chatbot de preguntas frecuentes.

⚠️ **Aviso importante:** las condiciones de ese nivel gratuito (qué modelos
incluye, cuántas peticiones por minuto permite, su política de uso de los
datos/conversaciones) **pueden cambiar en cualquier momento**, y no hay forma
de garantizar desde aquí que sigan siendo así en el futuro. Antes de
publicar esto, entra en [aistudio.google.com](https://aistudio.google.com)
y confirma:

1. Qué modelos están disponibles gratis ahora mismo (en `api/chat.js` se usa
   `gemini-2.0-flash` a fecha de creación de este proyecto — si Google cambia
   el nombre o lo retira del nivel gratuito, hay que actualizarlo).
2. El límite de peticiones por minuto/día del nivel gratuito (para un
   chatbot de una consulta médica con tráfico normal debería sobrar, pero
   compruébalo).
3. Su política de privacidad de datos en el nivel gratuito, por si en algún
   momento usan las conversaciones para mejorar sus modelos — si eso te
   preocupa por las conversaciones de tus pacientes, revísalo antes de
   activarlo.

Si en algún momento el nivel gratuito deja de existir o no te convence,
puedes seguir usando la web normalmente: basta con que el chatbot de texto
libre falle con elegancia (ya está programado así) y la gente use el
formulario de contacto, o puedes volver a las preguntas frecuentes con
respuestas fijas (sin IA) que ya teníamos antes.

## Cómo desplegarlo en Vercel (gratis)

1. **Sube este proyecto a un repositorio de GitHub** (todo el contenido de
   esta carpeta, incluida la carpeta `api/`).

2. **Crea una cuenta en [vercel.com](https://vercel.com)** (puedes entrar
   directamente con tu cuenta de GitHub).

3. **"Add New" → "Project"** y selecciona el repositorio. Vercel detecta
   automáticamente la carpeta `api/` y la convierte en un endpoint:
   `https://tu-dominio.vercel.app/api/chat`. No hace falta tocar ninguna
   configuración de build.

4. **Consigue tu clave gratuita de Gemini:**
   - Entra en [aistudio.google.com](https://aistudio.google.com)
   - Inicia sesión con una cuenta de Google
   - Busca "Get API key" / "Obtener clave de API" y créala
   - Copia la clave generada

5. **Antes de pulsar "Deploy"** (o después, desde Project → Settings →
   Environment Variables), añade una variable de entorno:

   - **Name:** `GEMINI_API_KEY`
   - **Value:** la clave que has copiado en el paso anterior

   Esta clave queda guardada de forma segura en los servidores de Vercel y
   nunca se envía al navegador del visitante.

6. **Deploy.** En 1-2 minutos tendrás la web online con el chatbot conectado
   a la IA (`https://tu-proyecto.vercel.app`).

7. Si más adelante quieres un dominio propio (por ejemplo
   `www.silviaperezrehabilitacion.com`), se añade desde Project → Settings →
   Domains.

## Cómo funciona el chatbot

- Las **8 preguntas rápidas** (botones) responden al instante con texto fijo,
  sin llamar a la IA en absoluto — así no consumen tu cuota gratuita ni
  dependen de que la IA esté disponible.
- Si el visitante **escribe su propia pregunta**, el navegador llama a
  `/api/chat`, que reenvía la pregunta (más el contexto de la conversación) a
  Gemini junto con la información de la consulta, y devuelve la respuesta.
- Si la IA no responde (cuota gratuita agotada por ese día/minuto, variable
  de entorno no configurada, sin conexión...), el chat lo dice y deriva
  amablemente al formulario de contacto, en vez de quedarse roto o en
  blanco.

## Recomendaciones antes de pasar a producción

- El `system` prompt (en `api/chat.js`) ya instruye a la IA para que no
  responda temas ajenos a la consulta ni dé diagnósticos o cifras inventadas;
  puedes editarlo libremente si cambian los datos de la consulta (precios,
  plazos, servicios, etc.).
- Si con el tiempo el sitio recibe mucho tráfico y el nivel gratuito empieza
  a quedarse corto (verás errores 429 en los logs de Vercel), valora si
  quieres pasar a un plan de pago en ese momento o limitar el chatbot a las
  preguntas rápidas fijas.
