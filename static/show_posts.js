const forward="forward"
const backward="backward"
const pageSize=5
const converter = new showdown.Converter()
let lastPost=0
let firstPostId=999999
let rendering=false

function appendPosts(start) {
  loadPosts(start, "forward", appendPostsCallback);
}

function prependPosts() {
  console.log("firstpost: " + (firstPostId - 1));
  loadPosts(firstPostId - 1, "backward", prependPostsCallback);
}

function loadPosts(start, direction, callback) {
  $.getJSON("/api/posts?start=" + start + "&size=" + pageSize + "&direction=" + direction, callback)
}
function prependPostsCallback(data) {
  data.forEach(post => {
    postContainer.prepend(renderPost(post));
    renderMap("map" + post.id, post.longditude, post.latitude);
  })
}
function appendPostsCallback(data) {
  data.forEach(post => {
    postContainer.append(renderPost(post));
    renderMap("map" + post.id, post.longditude, post.latitude);
    lastPost=post.id;
    console.log("lastpost: " + lastPost);
    window.scroll(window.pageXOffset, window.pageYOffset + 10); 
  })
}
function renderPost(post) {
  if (post.id < firstPostId) {
    firstPostId = post.id;
    console.log("firstpost: " + firstPostId);
  }
  var postMap = document.createElement("DIV");
  postMap.id = "map" + post.id
  postMap.className += "map"
  var postElement = document.createElement("DIV");

  var postContent = document.createElement("DIV");
  var postTitle = document.createElement("H1");
  postElement.append(postTitle);
  postElement.append(postMap);
  postElement.append(postContent);

  postContent.innerHTML = converter.makeHtml(post.content)
  postTitle.innerText= post.name
  return postElement
} 
function renderMap(elementId, longditude, latitude) {
    const lonLat = ol.proj.fromLonLat([latitude, longditude])
    const map = new ol.Map({
    controls: [],
    interactions: [],
    target: elementId,
    layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
    view: new ol.View({
        center: lonLat,
        zoom: 12
      })
    });
    var layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [
            new ol.Feature({
                geometry: new ol.geom.Point(lonLat)
            })
        ]
      })
    });
    map.addLayer(layer);
} 


window.onscroll = function(ev) {
    if (rendering) {
      return
    }
    if ((window.innerHeight + window.pageYOffset) >= document.body.scrollHeight) {
      console.log("bottom");
      rendering = true;
      console.log("rendering: " + rendering)
      appendPosts(lastPost + 1);
      rendering = false;
      console.log("rendering: " + rendering)

    }
    if (window.pageYOffset == 0) { 
      console.log("top");
      rendering = true;
      prependPosts();
      rendering = false;

    }
};