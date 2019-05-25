

// Get the hash of the url



const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'f2d3a3f8949d4c54905c23e1c967dd7c';
const redirectUri = "http://jacsonding.github.io/Team_Mango";
const scopes = [
  'user-top-read',
  'user-read-recently-played'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Make a call using the token

// First  Call: Get Users Recently Played Songs (Graph It)
console.log("Next2");
$.ajax({
   url: "https://api.spotify.com/v1/me/player/recently-played",
   type: "GET",
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
   console.log("Recently played Tracks");
     // Do something with the returned data
     console.log(data);
   }
});



// Second Call: Give Recommendations 
// Get Users Top Artists
$.ajax({
   url: "https://api.spotify.com/v1/me/top/artists",
   type: "GET",
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
     // Do something with the returned data
     data.items.map(function(artist) {
		 console.log(artist);
       let item = $('<li>' + artist.name + '</li>');
       item.appendTo($('#top-artists'));
     });
   }
});
	var base = 'https://api.spotify.com/v1/recommendations?';
	var market = 'market=US';
	var seed_artists= '&seed_artists=4NHQUGzhtTLFvgF5SZesLK';
	var seed_tracks = '&seed_tracks=0c6xIDDpzE81m2q797ordA&';
	var min_energy= '&min_energy = 0.4';

// Get Suggestions from Users Tracks
$.ajax({
	

   url: base+market+seed_artists+seed_tracks+min_energy,
   type: "GET",
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
     // Do something with the returned data
     data.items.map(function(artist) {
       let item = $('<li>' + artist.name + '</li>');
       item.appendTo($('#top-artists'));
     });
   }
});

// API Call Directory

// Users Recetly Played Songs




/*
*/

