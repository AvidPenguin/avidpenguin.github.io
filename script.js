var users = [];
var movies = [];
var showUnrleased = true;
var movieCount = 0;

// Initialize Firebase
var config = {
	apiKey: "AIzaSyAOTW95OYNmBZH3fNNCOG1ADQvYxLLdd6k",
	authDomain: "moviedatabase1212.firebaseapp.com",
	databaseURL: "https://moviedatabase1212.firebaseio.com",
	projectId: "moviedatabase1212",
	storageBucket: "moviedatabase1212.appspot.com",
	messagingSenderId: "469522124550"
};

firebase.initializeApp(config);
firebase.database().ref().child("users").once("value", function (snapshot) {
	// For each user in the database
	snapshot.forEach(function (child) {   
		firebase.database().ref('/users/' + child.key).once('value').then(function (snapshot2) {
			// 
			data = snapshot2.val();
			// 
			var newUser = new User(data.name, data.pass);
			// 
			users.push(newUser);
		});
	})
});
firebase.database().ref().child("movies").once("value", function (snapshot3) {
	// For each movie in the database
	snapshot3.forEach(function (child) {   
		firebase.database().ref('/movies/' + child.key).once('value').then(function (snapshot4) {
			// 
			data = snapshot4.val();
			// 
			var date = new Date(data.release.substring(6,12),data.release.substring(3,5),data.release.substring(0,2));
			//
			var newMovie = new Movie(child.key, data.title, data.director, date, data.imdb, data.image);
			movies.push(newMovie);
			//
			UpdateMovieList();
			document.getElementById('latestMovie').innerHTML="Newest Movie: "+data.title;
			document.getElementById('movieCount').innerHTML="Movies in Database: "+movies.length;
		});
	})
});

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = (this.value/2)-0.5;
}

function User(n,p) // Username, Password
{
	this.name = n;
	this.pass = p;
}

function Movie(id,t,d,r,im,img) // ID, Title, Director, Release Date (DD/MM/YYYY), IMDB Link, Image
{
	this.id = id;
	this.title = t;
	this.director = d;
	this.release = r;
	this.imdb = im;
	this.image = img;
}

function UpdateMovieList()
{
	document.getElementById("movieList").innerHTML = "";
	
	if(movies.length > 0)
	{
		
		var select = document.getElementById("newReviewSelect");
		select.options.length = 0;
		
		movies.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
		
		for (i = 0; i < movies.length; i++) //  For each movie in the database
		{
				select.options[select.options.length] = new Option(movies[i].title, movies[i].id);
		}
		movies.sort((a,b) => (a.release > b.release) ? 1 : ((b.release > a.release) ? -1 : 0));
		
		for (i = 0; i < movies.length; i++) //  For each movie in the database
		{		
			document.getElementById("movieList").innerHTML +=
				"<div class='movieWrapper'><img class='cover' src='" +
				movies[i].image +
				"' alt='" +
				movies[i].title +  
				" Cover'><p class='movieTitle'>" +
				movies[i].title +
				"</p><p class='movieText'>Director: " + 
				movies[i].director +
				"<br>Released: " + 
				movies[i].release.toDateString().substring(4) +
				"</p><a href='" + 
				movies[i].imdb +
				"' class='btn btn-primary'>IMDB Link</a><span> </span><button class='btn btn-primary' onclick=\"AddReview('" + 
				movies[i].id +
				"')\">Add Review</button></div><span> </span>";
		
		}
	}
}

function ChangeView(loc)
{
	document.getElementById("main").classList.add("hidden");
	document.getElementById("movies").classList.add("hidden");
	document.getElementById("newmovie").classList.add("hidden");
	document.getElementById("newreview").classList.add("hidden");
	
	switch(loc) {
	  case 'home':
		document.getElementById("main").classList.remove("hidden");
		break;
	  case 'newmovie':
		document.getElementById("newmovie").classList.remove("hidden");
		break;
	  case 'newreview':
		document.getElementById("newreview").classList.remove("hidden");
		break;
	  case 'movies':
		document.getElementById("movies").classList.remove("hidden");
		break;
	  default:
		document.getElementById("main").classList.remove("hidden");
		break;
	}
}

function AddNewMovie()
{
	var id = document.getElementById("newMovieID").value;
	var t = document.getElementById("newMovieTitle").value;
	var d = document.getElementById("newMovieDirector").value;
	var r = document.getElementById("newMovieRelease").value;
	var im = document.getElementById("newMovieIMDB").value;
	var img = document.getElementById("newMovieImage").value;
	
	var error = false;
	
	if(id.length < 3){
		error = true;
	}
	if(t.length < 3){
		error = true;
	}
	if(d.length < 3){
		error = true;
	}
	if(r.length < 3){
		error = true;
	}
	if(im.length < 3){
		error = true;
	}
	if(img.length < 3){
		error = true;
	}
	
	if(error)
	{
		alert("error");
	}
	else
	{
		writeUserData(id,t,d,r,im,img);
	}
}

function writeUserData(id,t,d,r,im,img) // ID, Title, Director, Release Date (DD/MM/YYYY), IMDB Link, Image
{
	firebase.database().ref('movies/' + id).set({
    title: t,
    director: d,
    release: r,
    imdb: im,
    image: img
  }, function(error) {
    if (error) {
      // The write failed...
    } else {
		location.reload(); //Once the data was successfully passed, the page reloads.
    }
  });
}

function ReloadPage()
{
	location.reload();
}

function CheckNewMovie()
{
	var id = document.getElementById("newMovieID").value;
	var t = document.getElementById("newMovieTitle").value;
	var d = document.getElementById("newMovieDirector").value;
	var r = document.getElementById("newMovieRelease").value;
	var im = document.getElementById("newMovieIMDB").value;
	var img = document.getElementById("newMovieImage").value;
	var imgPreview = document.getElementById("CheckMovieImage");
	var errors = document.getElementById("CheckMovieErrors");
	errors.innerHTML = "";
	
	if(id.length < 2)
	{
		errors.innerHTML += "<br>Movie ID is too short";
	}
	if(t.length < 1)
	{
		errors.innerHTML += "<br>Title is blank";
	}
	if(d.length < 1)
	{
		errors.innerHTML += "<br>Director Name is blank";
	}
	if(r.length != 10)
	{
		errors.innerHTML += "<br>Release Date is incorrect";
	}
		
		imgPreview.src = img;
}