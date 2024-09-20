import React from "react";

interface YoutubeProps {
  url: string; // YouTube URL을 받는 props
}

const Youtube: React.FC<YoutubeProps> = ({ url }) => {
  // YouTube URL에서 영상 ID 추출
  const getVideoId = (url: string) => {
    const regex =
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return <div>Invalid YouTube URL</div>; // 유효하지 않은 URL 처리
  }

  return (
    <div className="relative w-full h-auto py-20">
      <iframe
        width="1000"
        height="500"
        src="https://www.youtube.com/embed/EwqRj6SHNxg?autoplay=1&controls=0&modestbranding=1&mute=1&loop=1&playlist=EwqRj6SHNxg"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Youtube;
