/**
 * Parses any YouTube URL format (watch, shorts, live, embed, or raw 11-char ID)
 * and returns a clean embeddable YouTube iframe URL.
 */
export function getYouTubeEmbedUrl(input: string): string {
  if (!input || !input.trim()) {
    // Default fallback working YouTube live stream / video
    return 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&enablejsapi=1';
  }

  const clean = input.trim();

  // Extract 11-character YouTube video ID using regex
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|live\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = clean.match(regExp);

  const videoId = (match && match[2] && match[2].length === 11) ? match[2] : (clean.length === 11 ? clean : null);

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&enablejsapi=1`;
  }

  // If already a valid http(s) embed URL
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    if (clean.includes('youtube.com/embed/')) {
      return clean;
    }
  }

  return `https://www.youtube.com/embed/${clean}?autoplay=1&mute=0&enablejsapi=1`;
}
