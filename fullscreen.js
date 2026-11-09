const fullscreenButton = document.getElementById('fullscreen-button');
const fullscreenMessage = document.getElementById('fullscreen-message');

function updateFullscreenButton() {
  const active = Boolean(document.fullscreenElement);
  const label = active ? 'إنهاء ملء الشاشة' : 'عرض بملء الشاشة';
  fullscreenButton.setAttribute('aria-pressed', String(active));
  fullscreenButton.setAttribute('aria-label', label);
  fullscreenButton.title = label;
  fullscreenMessage.textContent = '';
}

fullscreenButton.addEventListener('click', async () => {
  fullscreenMessage.textContent = '';
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else {
      fullscreenMessage.textContent = 'ملء الشاشة غير متاح في هذا المتصفح.';
    }
  } catch (error) {
    fullscreenMessage.textContent = 'تعذّر فتح ملء الشاشة في هذا المتصفح.';
  }
});

document.addEventListener('fullscreenchange', updateFullscreenButton);
updateFullscreenButton();
