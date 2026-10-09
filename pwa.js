(() => {
  let installPrompt = null;
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const card = document.createElement('section');
  card.className = 'card p-4 mt-4';
  card.innerHTML = '<h2 class="font-bold">📱 TorgAI қолданбасын орнату</h2><p id="pwa-status" class="text-xs muted mt-2" role="status"></p><button id="pwa-install" class="action w-full mt-3" type="button" hidden>Қосымшаны орнату</button><p id="pwa-help" class="text-xs muted mt-3">Android: Chrome мәзірі ⋮ → «Қолданбаны орнату» немесе «Басты экранға қосу». iPhone: Safari → Бөлісу → «Басты экранға қосу».</p>';
  (document.querySelector('#profile') || document.querySelector('main')).append(card);
  const status = card.querySelector('#pwa-status'), button = card.querySelector('#pwa-install');
  function updateUI() {
    const installed = standalone();
    button.hidden = installed || !installPrompt;
    card.querySelector('#pwa-help').hidden = installed;
    status.textContent = installed ? 'TorgAI дербес қолданба режимінде ашылды.' : 'Орнатқаннан кейін TorgAI белгішесінен ашыңыз — мекенжай жолағы көрсетілмейді.';
  }
  window.addEventListener('beforeinstallprompt', event => {event.preventDefault(); installPrompt = event; updateUI();});
  window.addEventListener('appinstalled', () => {installPrompt = null;updateUI();status.textContent = 'Орнатылды! Басты экрандағы TorgAI белгішесін басыңыз.';});
  button.addEventListener('click', async () => {
    if (!installPrompt) return;
    const prompt = installPrompt;installPrompt = null;button.disabled = true;
    try {await prompt.prompt();await prompt.userChoice;} catch {status.textContent = 'Орнатуды браузер мәзірінен таңдаңыз.';}
    finally {button.disabled = false;button.hidden = true;}
  });
  updateUI();
  if ('serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:') {
    navigator.serviceWorker.register(new URL('./sw.js', document.baseURI), {scope: new URL('./', document.baseURI).href, updateViaCache:'none'}).catch(() => {status.textContent = 'Орнату қызметі іске қосылмады. Интернетті тексеріп, бетті қайта ашыңыз.';});
  } else status.textContent = 'PWA орнату үшін сайтты HTTPS арқылы ашыңыз.';
})();
