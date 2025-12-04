/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }
};

/* Entry point of our client code. Runs when window.onload fires.
   Sets up the event listeners for each form across the whole app.
*/
const init = () => {
  const signupForm = document.getElementById('signupForm');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const loginForm = document.getElementById('loginForm');
  const championshipForm = document.getElementById('championshipForm');

  /* If this page has the signupForm, add it's submit event listener.
     Event listener will grab the username, password, and password2
     from the form, validate everything is correct, and then will
     use sendPost to send the data to the server.
  */
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = signupForm.querySelector('#user').value;
      const pass = signupForm.querySelector('#pass').value;
      const pass2 = signupForm.querySelector('#pass2').value;

      if (!username || !pass || !pass2) {
        handleError('All fields are required!');
        return false;
      }

      if (pass !== pass2) {
        handleError('Passwords do not match!');
        return false;
      }

      sendPost(signupForm.getAttribute('action'), { username, pass, pass2 });
      return false;
    });
  }

  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const pass = changePasswordForm.querySelector('#pass').value;
      const pass2 = changePasswordForm.querySelector('#pass2').value;

      if (pass !== pass2) {
        handleError('Passwords do not match!');
        return false;
      }

      sendPost(changePasswordForm.getAttribute('action'), { pass, pass2 });
      return false;
    });
  }

  /* If this page has the loginForm, add it's submit event listener.
     Event listener will grab the username, password, from the form,
     validate both values have been entered, and will use sendPost
     to send the data to the server.
  */
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = loginForm.querySelector('#user').value;
      const pass = loginForm.querySelector('#pass').value;

      if (!username || !pass) {
        handleError('Username or password is empty!');
        return false;
      }

      sendPost(loginForm.getAttribute('action'), { username, pass });
      return false;
    });
  }

  // Championship creation form listener
  if (championshipForm) {
    championshipForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = championshipForm.querySelector('#championshipName').value;

      if (!name) {
        handleError('Championship name is required!');
        return false;
      }

      sendPost(championshipForm.getAttribute('action'), { name });
      return false;
    });
  }

  // Loops through each championship form and adds corresponding listener
  // with correct championship name
  // It gets the name from the id which is set by the server via handlebars
  // in championships.handlebars
  const fileForms = document.querySelectorAll('#championship form');

  fileForms.forEach((form) => {
    const championshipName = form.id.split('-')[0];

    const currentForm = form;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(currentForm);
      formData.append('name', championshipName);

      const response = await fetch('/addRace', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.redirect) {
        window.location = result.redirect;
      }

      if (result.error) {
        handleError(result.error);
      }

      return false;
    });
  });

  document.getElementById('premium-button').addEventListener('click', async () => {
    const response = await fetch('/togglePremium', {
      method: 'POST',
    });

    const result = await response.json();

    if (result.redirect) {
      window.location = result.redirect;
    }

    if (result.error) {
      handleError(result.error);
    }

    return false;
  });
};

// Call init when the window loads.
window.onload = init;
