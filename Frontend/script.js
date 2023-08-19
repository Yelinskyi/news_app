function getNewsFromServer() {
  return fetch('http://localhost:3000/news')
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

    // Add news content to the central column
    const newsDiv = document.createElement("div");
    newsDiv.classList.add("news");
    newsDiv.id = `news-${index}`;
    newsDiv.innerHTML = `
    <h2>${newsItem.title}</h2>
    <div class="news-info">
      <span class="date">Date: ${newsItem.date}</span>
      <p>${newsItem.text}</p>
      <a href="#" class="comments-link" onclick="toggleComments(${index}, event)">comments</a>
      <ul class="comments-list hidden" id="comments-${index}"></ul>
      <!-- Form for adding comments -->
      <div class="comment-form hidden">
        <textarea placeholder="Enter your comment" id="comment-text-${index}"></textarea>
        <button onclick="addComment(${index})">Add Comment</button>
      </div>
    </div>
  `;
    centerColumn.appendChild(newsDiv);
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

  newsData[index].comments.forEach(comment => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="comment-author">${comment.author}</span>
      <span class="comment-date">Date: ${comment.date}</span>
      <p>${comment.text}</p>
    `;
    commentsList.appendChild(li);
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

  const date = new Date().toLocaleDateString();
  const comment = { author, date, text, newsid: newsData[index]._id};
  newsData[index].comments.push(comment);
  // Send new comment to DB
  sendCommentToNews(comment);

  textInput.value = "";

  showComments(index);
}

// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   console.log(parts);
//   if (parts.length === 2) return parts.pop().split(';').shift();
// }

function sendCommentToNews(comment) {
  // let jwtToken = getCookie('jwt');
  // console.log(jwtToken)
  // jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InllbGluc2t5aUBpY2xvdWQuY29tIiwiaWF0IjoxNjkyMzI2NTMwLCJleHAiOjE2OTIzNjk3MzB9.JeF72ABsvd6Ze3uACGEYFp-EMRehXk3ffPyZ6dPHeXk";
  
  jwtToken = localStorage.getItem("jwt");
  fetch('http://localhost:3000/addcomment',
    { 
      method: "POST", 
      headers: { 
        "Accept": "application/json", 
        "Content-Type": "application/json",
        "jwt": jwtToken
       },
      body: JSON.stringify(comment),
      // credentials: 'include',
      // credentials: "same-origin"
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

  // LOGIN
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", function () {
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const email = emailInput.value;
    const password = passwordInput.value;

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        console.log("Response headers:", response.headers);
    
        const jwtHeader = response.headers.get("jwt");
        if (jwtHeader) {
          localStorage.setItem("jwt", jwtHeader);
          console.log("JWT token:", jwtHeader);
        }
    
        const cookies = response.headers.get("Set-Cookie");
        if (cookies) {
          console.log("Cookies received:", cookies);
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
        showLoginOrLogout();
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });

  //LOGOUT
  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", function () {
    fetch("http://localhost:3000/logout", {
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
    if (jwtToken && jwtToken !== "") {
      logoutDiv.style.display = "block";
      loginDiv.style.display = "none";
    } else {
      logoutDiv.style.display = "none";
      loginDiv.style.display = "block";
    }
  }
  showLoginOrLogout();
