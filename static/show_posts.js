const forward="forward"
const backward="backward"
const pageSize=5
const converter = new showdown.Converter()
let lastPost=0
let firstPostId=999999
let rendering=false

function initPosts(start) {
  rendering = true;
  loadPosts(start, "forward", initPostsCallback);
}

function appendPosts(start) {
  if (rendering) return;
  rendering = true;
  loadPosts(start, "forward", appendPostsCallback);
}

function prependPosts() {
  if (rendering) return;
  rendering = true;
  loadPosts(firstPostId - 1, "backward", prependPostsCallback);
}

function loadPosts(start, direction, callback) {
  $.getJSON("/api/posts?start=" + start + "&size=" + pageSize + "&direction=" + direction, callback);

}
function prependPostsCallback(data) {
  console.log("rendering " + rendering);
  var currentElement = firstPostId;
  data.forEach(post => {
    postContainer.prepend(renderPost(post));
    renderMap("map" + post.id, post.longditude, post.latitude);
  })
  rendering = false;
  goTo(currentElement);
}
function appendPostsCallback(data) {
  console.log("rendering " + rendering);
  data.forEach(post => {
    postContainer.append(renderPost(post));
    renderMap("map" + post.id, post.longditude, post.latitude);
    lastPost=post.id;
    console.log("lastpost: " + lastPost);
    window.scroll(window.pageXOffset, window.pageYOffset + 10); 
  })
  rendering = false;

}
function initPostsCallback(data) {
  appendPostsCallback(data);
  prependPosts();
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
  postContent.className += "postContent"
  var postTitle = document.createElement("H1");
  postElement.append(postMap);
  postElement.append(postTitle);
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

function goTo(id) {
  location.href = "#";
  location.href = "#map" + id;
}


window.onscroll = function(ev) {
    if ((window.innerHeight + window.pageYOffset) >= document.body.scrollHeight) {
      console.log("bottom");
      appendPosts(lastPost + 1);
    }
    if (window.pageYOffset == 0) { 
      console.log("top");
      prependPosts();
    }
};