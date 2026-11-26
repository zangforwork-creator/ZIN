const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}));

const authDialog = document.querySelector('#auth-dialog');
const authTitle = document.querySelector('#auth-title');
const authStatus = document.querySelector('#auth-status');
const emailForm = document.querySelector('#email-form');
const phoneForm = document.querySelector('#phone-form');
const previewMessage = 'Account sign-in is not connected yet. You can plan a stay without an account.';

document.querySelectorAll('.auth-trigger').forEach(button => {
  button.addEventListener('click', () => {
    authTitle.textContent = button.dataset.authMode === 'log-in' ? 'Log in' : 'Sign in';
    authStatus.textContent = previewMessage;
    emailForm.hidden = true;
    phoneForm.hidden = true;
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    authDialog.showModal();
  });
});

document.querySelector('.auth-close').addEventListener('click', () => authDialog.close());
authDialog.addEventListener('click', event => {
  if (event.target === authDialog) authDialog.close();
});

document.querySelectorAll('.auth-method').forEach(button => {
  button.addEventListener('click', () => {
    const method = button.dataset.method;
    emailForm.hidden = method !== 'email';
    phoneForm.hidden = method !== 'phone';
    authStatus.textContent = method === 'google'
      ? 'Google sign-in will be available when accounts launch.'
      : previewMessage;
    if (method === 'email') document.querySelector('#auth-email').focus();
    if (method === 'phone') document.querySelector('#auth-phone').focus();
  });
});

[emailForm, phoneForm].forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    authStatus.textContent = 'Thanks for your interest. Account sign-in will be available soon; no details were sent or saved.';
    form.reset();
  });
});
