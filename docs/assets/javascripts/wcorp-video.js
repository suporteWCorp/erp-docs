(function () {
  const videoObjectUrls = new Map();

  function cleanupDetachedVideoUrls() {
    videoObjectUrls.forEach((url, video) => {
      if (!video.isConnected) {
        URL.revokeObjectURL(url);
        videoObjectUrls.delete(video);
      }
    });
  }

  async function prepareSeekableVideo(video) {
    if (video.dataset.wcSeekable) return;

    const source = video.querySelector("source[src]");
    if (!source) return;

    video.dataset.wcSeekable = "loading";

    try {
      const response = await fetch(source.src, {
        cache: "no-store",
        headers: { Range: "bytes=0-0" }
      });

      if (response.status === 206) {
        if (response.body) await response.body.cancel();
        video.dataset.wcSeekable = "native";
        return;
      }

      if (!response.ok) throw new Error(`Falha ao carregar vídeo: ${response.status}`);

      const blob = await response.blob();
      if (!video.isConnected) return;

      const objectUrl = URL.createObjectURL(blob);
      videoObjectUrls.set(video, objectUrl);
      video.src = objectUrl;
      video.load();
      video.dataset.wcSeekable = "blob";
    } catch (_error) {
      video.dataset.wcSeekable = "native";
    }
  }

  function prepareSeekableVideos() {
    cleanupDetachedVideoUrls();
    document.querySelectorAll("video.wc-video").forEach(prepareSeekableVideo);
  }

  document.addEventListener("DOMContentLoaded", prepareSeekableVideos);

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(prepareSeekableVideos);
  }
})();
