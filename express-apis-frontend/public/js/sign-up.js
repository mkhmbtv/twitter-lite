import { errorHandler } from "./utils.js";

const signUpForm = document.querySelector('.sign-up-form');

signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
 
  const formData = new FormData(signUpForm);
  const email = formData.get('email');
  const password = formData.get('password');
  const username = formData.get('username');
  const body = { email, password, username };

  try {
    const res = await fetch('http://localhost:8080/users', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw res;
    }

    const {
      token,
      user: { id },
    } = await res.json();

    localStorage.setItem('TWITTER_LITE_ACCESS_TOKEN', token);
    localStorage.setItem('TWITTER_LITE_CURRENT_USER_ID', id);
    window.location.href = '/';
  } catch (err) {
    errorHandler(err);
  }
});