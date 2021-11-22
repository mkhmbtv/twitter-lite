import { errorHandler } from "./utils.js";

const fetchAllTweets = async () => {
  try {
    const res = await fetch('http://localhost:8080/tweets', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('TWITTER_LITE_ACCESS_TOKEN')}`,
      },
    });

    if (res.status === 401) {
      window.location.href = '/log-in';
      return;
    }

    const { tweets } = await res.json();
    const tweetsContainer = document.querySelector('#tweets-container');
    const tweetsHtml = tweets.map(
      ({ message, user: { username } }) => `
      <div class="card">
        <div class="card-header">
          ${username}
        </div>
        <div class="card-body">
          <p class="card-text">${message}</p>
        </div>
      </div>
    `
    );

    tweetsContainer.innerHTML = tweetsHtml.join('');
  } catch (e) {
    console.log(e);
  }
};

const createTweet = () => {
  const form = document.querySelector('.create-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const message = formData.get('message');
    const body = { message };

    try {
      const res = await fetch('http://localhost:8080/tweets', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('TWITTER_LITE_ACCESS_TOKEN')}`,
        },

      });

      if (res.status === 401) {
        window.location.href = '/log-in';
        return;
      }

      if (!res.ok) {
        throw res;
      }

      form.reset();

      fetchAllTweets();

    } catch (err) {
      errorHandler(err);
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  fetchAllTweets();
  createTweet();
});