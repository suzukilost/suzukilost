(function() {
  var container = document.getElementById("post-grid-container");
  var loadMoreButton = document.getElementById("load-more-posts");
  var nextFeedUrl = "https://suzukilost.blogspot.com/feeds/posts/default?alt=json-in-script&max-results=12&callback=displayPosts";

  function displayPosts(json) {
    var posts = json.feed.entry || [];
    for(var i=0;i<posts.length;i++){
      var post = posts[i];
      var title = post.title.$t;
      var url = post.link.find(function(l){return l.rel==='alternate';}).href;
      var author = post.author[0].name.$t;
      var published = new Date(post.published.$t).toLocaleDateString();
      var thumbnail = post.media$thumbnail ? post.media$thumbnail.url.replace(/s72-c/,"s400-c") : "https://via.placeholder.com/400";
      var description = post.summary ? post.summary.$t.replace(/<[^>]+>/g,'').substring(0,120)+"..." : "";

      var postHtml = '<div class="post">'
        + '<a href="'+url+'">'
        + '<img src="'+thumbnail+'" alt="'+title+'">'
        + '<div class="content">'
        + '<h2>'+title+'</h2>'
        + '<p>'+description+'</p>'
        + '<div class="meta">'
        + '<span>By '+author+'</span> | <span>'+published+'</span>'
        + '</div></div></a></div>';

      container.insertAdjacentHTML('beforeend', postHtml);
    }

    var nextLink = json.feed.link.find(function(l){return l.rel==='next';});
    nextFeedUrl = nextLink ? nextLink.href + "&alt=json-in-script&callback=displayPosts" : null;
    loadMoreButton.style.display = nextFeedUrl ? "inline-block" : "none";
  }

  function loadPosts() {
    if(!nextFeedUrl) return;
    var script = document.createElement('script');
    script.src = nextFeedUrl;
    document.body.appendChild(script);
  }

  loadMoreButton.addEventListener('click', loadPosts);
  loadPosts();
})();
