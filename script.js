/* Init */
// Get the hash of the url
const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function(initial, item) {
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
    'user-read-recently-played',
    'user-library-modify',
    'user-library-read',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-collaborative',
    'user-read-email',
    'user-read-birthdate',
    'user-read-private'
];


// If there is no token, redirect to Spotify authorization
if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Users Recently Played Songs
var usrTracks = []; // how to access valence: usrTracks[0]
var valenceArr =[];
// USers Top Artists
var usrArtists = [];

// Reccomendation URL for API Call
var base = 'https://api.spotify.com/v1/recommendations?';
var market = 'market=US';
var seed_artists = '&seed_artists=4NHQUGzhtTLFvgF5SZesLK';
var seed_tracks = '&seed_tracks=0c6xIDDpzE81m2q797ordA&';
var min_energy = '&min_energy=0.4';
var reccURL = base + market + seed_artists + seed_tracks + min_energy;


/* API CALLS */
// API Call Get Users Recently Played Songs (Graph It)
$.ajax({
    url: "https://api.spotify.com/v1/me/player/recently-played",
    type: "GET",
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    },
    success: function(data) {
        usrTracks = data.items; // set Recent Track Array
		// Get Valence of those Recent Track Array
		for(var i=0;i<data.items.length;i++){
			console.log(data.items[i].track.id);
			valenceArr.push(data.items[i].track.id);
		}

		// Get Valences
		var getValenceURL = "https://api.spotify.com/v1/audio-features?ids=" + valenceArr.toString();

		 $.ajax({
        url: getValenceURL,
        type: "GET",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function(data) {
            console.log(valenceArr = data.audio_features);
			// Offer Playlist Reccs from Reccomendation Array


        }
    });
    }
});



//Second Step:
// Get Users Top Artists for playlist suggestion
$.ajax({
    url: "https://api.spotify.com/v1/me/top/artists",
    type: "GET",
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
    },
    success: function(data) {
        data.items.map(function(artist) {
            usrArtists.push(artist);
        });
    }
});




// Custom Playlist Suggestion
function getCustomPL() {
    console.log("AFTER Getting custom with parameters " + reccURL);
    $.ajax({
        url: reccURL,
        type: "GET",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function(data) {
            console.log(data);
			// Offer Playlist Reccs from Reccomendation Array
            for (var i = 0; i < data.tracks.length; i++) {
                let item = $('<li>' + data.tracks[i].name + " " + data.tracks[i].artists[0].name + '</li>');
                item.appendTo($('#top-artists'));
            }

        }
    });
	console.log(usrTracks);
}

function graphData() {
    var data = valenceArr
    //http://bl.ocks.org/jfreels/6816504
    var body = d3.select('#D3JS')

    var margin = { top: 50, right: 50, bottom: 50, left: 50 }
    var h = 500 - margin.top - margin.bottom
    var w = 500 - margin.left - margin.right
    var formatPercent = d3.format('.2%')

    var colorScale = d3.scale.category20()
    var xScale = d3.scale.linear().domain([0,1]).range([0,w])
    var yScale = d3.scale.linear().domain([0,1]).range([h,0])

    // SVG
    var svg = body.append('svg')
        .attr('height',h + margin.top + margin.bottom)
        .attr('width',w + margin.left + margin.right)
      .append('g')
        .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
    // X-axis
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .tickFormat(formatPercent)
      .ticks(5)
      .orient('bottom')
    // Y-axis
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .tickFormat(formatPercent)
      .ticks(5)
      .orient('left')

      var circles = svg.selectAll('circle')
     .data(data)
     .enter()
   .append('circle')
     .attr('cx',function (d) { return xScale(d.valence) })
     .attr('cy',function (d) { return yScale(d.energy) })
     .attr('r','10')
     .attr('stroke','black')
     .attr('stroke-width',1)
     .attr('fill',function (d,i) { return colorScale(i) })
     .on('mouseover', function () {
       d3.select(this)
         .transition()
         .duration(500)
         .attr('r',20)
         .attr('stroke-width',3)
     })
     .on('mouseout', function () {
       d3.select(this)
         .transition()
         .duration(500)
         .attr('r',10)
         .attr('stroke-width',1)
     })
   .append('title') // Tooltip
     .text(function (d) { return d.valence })
                          //+ '\nValence: ' + formatPercent(d.aror) +
                          // '\nStd. Dev.: ' + formatPercent(d.asd) })
     // X-axis
     svg.append('g')
         .attr('class','axis')
         .attr('transform', 'translate(0,' + h + ')')
         .call(xAxis)
       .append('text') // X-axis Label
         .attr('class','label')
         .attr('y',-10)
         .attr('x',w)
         .attr('dy','.71em')
         .style('text-anchor','end')
         .text('Valence')
     // Y-axis
     svg.append('g')
         .attr('class', 'axis')
         .call(yAxis)
       .append('text') // y-axis Label
         .attr('class','label')
         .attr('transform','rotate(-90)')
         .attr('x',0)
         .attr('y',5)
         .attr('dy','.71em')
         .style('text-anchor','end')
         .text('Energy')
}

function analyzeFB(){
	FB.api(
  '/me',
  'GET',
  {"fields":"id,name,posts"},
  function(response) {
console.log(response)
  }
);
}

// How to get valence of songs
// for i in rage usrTracks[i].track

console.log("update");

/*
 */
