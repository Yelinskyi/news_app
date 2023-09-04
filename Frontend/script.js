function getNewsFromServer() {
  // return fetch('http://localhost:3000/news')
  return fetch('https://arcane-refuge-43265-ef7d32e9edde.herokuapp.com/news')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      return [];
    });
}

let newsData = [];
getNewsFromServer()
  .then(data => {
    newsData = data;
    console.log(newsData);
    showNews(newsData);
  })
  .catch(error => {
    console.error('Error processing news data:', error);
  });

function showNews(newsFromServer) {
  const centerColumn = document.querySelector(".center-column");

  newsFromServer.forEach((newsItem, index) => {

    let isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      isAdmin = undefined;
    }

    // Add news content to the central column
    const newsDiv = document.createElement("div");
    newsDiv.classList.add("news");
    newsDiv.id = `news-${index}`;
    newsDiv.innerHTML = `
    <h2>${newsItem.title}</h2>
    <div class="news-info">
      <span class="date">Date: ${newsItem.date}</span>
      <p>${newsItem.text}</p>
      ${isAdmin ? `<button id="btn-del-news-${newsItem._id}" class="delete-news-button" data-comment-id="${newsItem._id}">
      <img src="../public/icons/delete.png" alt="Delete">
      </button>` : ''}
      <a href="#" class="comments-link" onclick="toggleComments(${index}, event)">comments</a>
      <ul class="comments-list hidden" id="comments-${index}"></ul>
      <!-- Form for adding comments -->
      <div class="comment-form hidden">
        <textarea placeholder="Enter your comment" id="comment-text-${index}"></textarea>
        <button id="comment-btn-${index}" onclick="addComment(${index})">Add Comment</button>
      </div>
    </div>
  `;
    centerColumn.appendChild(newsDiv);

    const deleteNewsButton = document.getElementById(`btn-del-news-${newsItem._id}`);
    deleteNewsButton.addEventListener("click", () => {
      deleteNews(newsItem._id);
    });

    const textInput = document.getElementById(`comment-text-${index}`);
    const commentBtn = document.getElementById(`comment-btn-${index}`);
    commentBtn.disabled = true;
    textInput.addEventListener("input", () => {
      const jwtToken = localStorage.getItem("jwt");
      if (textInput.value.trim() !== "" && jwtToken && jwtToken !== "") {
        commentBtn.disabled = false;
      } else {
        commentBtn.disabled = true;
      }
    });
  });
}

function toggleComments(index, event) {
  event.preventDefault();

  const commentsList = document.getElementById(`comments-${index}`);
  const commentForm = document.querySelector(`#news-${index} .comment-form`);
  const commentsLink = document.querySelector(`#news-${index} .comments-link`);
  
  commentsList.classList.toggle("hidden");
  commentForm.classList.toggle("hidden");

  // Update the text of the link to "comments" or "hide comments"
  commentsLink.innerText = commentsList.classList.contains("hidden") ? "comments" : "hide comments";

  // Show comments if they are currently hidden
  if (!commentsList.classList.contains("hidden")) {
    showComments(index);
  }
}

function showComments(index) {
  const commentsList = document.getElementById(`comments-${index}`);
  commentsList.innerHTML = "";

  let isAdmin = localStorage.getItem('isAdmin');
  if (isAdmin !== 'true') {
    isAdmin = undefined;
  }

  newsData[index].comments.forEach(comment => {
    const li = document.createElement("li");
    li.setAttribute('id', comment._id);
    li.innerHTML = `
      <span class="comment-author">${comment.author}</span>
      <span class="comment-date">Date: ${comment.date}</span>
      ${isAdmin ? `<button id="btn-del-comment-${comment._id}" class="delete-comment-button" data-comment-id="${comment._id}">
        <img src="../public/icons/delete.png" alt="Delete">
      </button>` : ''}
      <p>${comment.text}</p>
    `;

    commentsList.appendChild(li);
    
    const deleteButton = document.getElementById(`btn-del-comment-${comment._id}`);
    deleteButton.addEventListener("click", () => {
      deleteComment(comment._id);
    });
    
  });
}

function addComment(index) {
  const textInput = document.getElementById(`comment-text-${index}`);

  const author  = localStorage.getItem("nickname");
  const text = textInput.value.trim();

  if (!text) {
    alert("Please fill in all fields.");
    return;
  }

  const date = new Date().toLocaleString();
  const comment = { author, text, date, newsid: newsData[index]._id};
  newsData[index].comments.push(comment);
  // Send new comment to DB
  sendCommentToNews(comment);

  textInput.value = "";

  showComments(index);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  console.log(parts);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// SEND NEW COMMENT TO BD
function sendCommentToNews(comment) {
  let jwtToken = getCookie('jwt');
  console.log(jwtToken)
  
  jwtToken = localStorage.getItem("jwt");
  // fetch('http://localhost:3000/addcomment',
  fetch('https://arcane-refuge-43265-ef7d32e9edde.herokuapp.com/addcomment',
    { 
      method: "POST", 
      headers: { 
        "Accept": "application/json", 
        "Content-Type": "application/json",
        "jwt": jwtToken
       },
      credentials: 'include',
      body: JSON.stringify(comment),
    }
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      return [];
    });
}

// DELETE COMMENT
function deleteComment(commentId) {
  console.log(`Deleting comment with ID: ${commentId}`);
  jwtToken = localStorage.getItem("jwt");
  // fetch(`http://localhost:3000/deletecomment/${commentId}`, {
  fetch(`https://arcane-refuge-43265-ef7d32e9edde.herokuapp.com/deletecomment/${commentId}`, {
    method: "DELETE",
    headers: { 
      "Accept": "application/json", 
      "Content-Type": "application/json",
      "jwt": jwtToken
     },
  })
    .catch(error => {
      console.error("Error deleting comment:", error);
    });
}

// DELETE NEWS
function deleteNews(newsId) {
  console.log(`Deleting newst with ID: ${newsId}`);
  jwtToken = localStorage.getItem("jwt");
  fetch(`https://arcane-refuge-43265-ef7d32e9edde.herokuapp.com/deletenews/${newsId}`, {
    method: "DELETE",
    headers: { 
      "Accept": "application/json", 
      "Content-Type": "application/json",
      "jwt": jwtToken
     },
  })
    .catch(error => {
      console.error("Error deleting news:", error);
    });
}

  // LOGIN
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", function () {
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const email = emailInput.value;
    const password = passwordInput.value;

    // fetch("http://localhost:3000/login", {
    fetch("https://arcane-refuge-43265-ef7d32e9edde.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        console.log("Response headers:", response.headers);
        const jwtHeader = response.headers.get("jwt");
        console.log("JWT token:", jwtHeader);
        if (jwtHeader) {
          localStorage.setItem("jwt", jwtHeader);
        }
    
        const cookies = response.headers.get("Set-Cookie");
        console.log("Cookies received:", cookies);
        if (cookies) {
          const cookieArray = cookies.split("; ");
          for (const cookie of cookieArray) {
            const [name, value] = cookie.split("=");
            localStorage.setItem(name, value);
            console.log(`Set cookie ${name} with value ${value}`);
          }
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('nickname', data.nickname);
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('isAdmin', data.isAdmin);
        showLoginOrLogout();
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });

  //LOGOUT
  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", function () {
    // fetch("http://localhost:3000/logout", {
    fetch("https://arcane-refuge-43265-ef7d32e9edde.herokuapp.com/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        localStorage.clear();
        return response.json();
      })
      .then(data => {
      showLoginOrLogout();
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });

  // SHOW logIN or logOUT
  function showLoginOrLogout () {
    const jwtToken = localStorage.getItem("jwt");
    const logoutDiv = document.getElementById("logout");
    const loginDiv = document.getElementById("login");
    const logoutButton = document.getElementById("logout-button");
    const userNickname = localStorage.getItem("nickname");

    if (userNickname) {
      logoutButton.textContent = userNickname + ", Logout";
    }

    let isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      isAdmin = undefined;
    }
    const addNewsBtn = document.getElementById("addmews-btn");
    if (jwtToken && jwtToken !== "") {
      logoutDiv.style.display = "block";
      loginDiv.style.display = "none";
      console.log("ISADMIN: ", isAdmin)
      if (isAdmin === 'true') {
        addNewsBtn.hidden = false;
      }
    } else {
      logoutDiv.style.display = "none";
      loginDiv.style.display = "block";
    }
  }
  showLoginOrLogout();
