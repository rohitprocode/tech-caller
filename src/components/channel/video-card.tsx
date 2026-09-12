import Image from "next/image";
import { ArrowUpRight, Play, TrendingUp } from "lucide-react";
import { channel } from "@/content/channel";

export function VideoCard({ video }: { video: typeof channel.featuredVideos[number] }) {
  return (
    <article className="video-card">
      <a href={video.url} target="_blank" rel="noreferrer" aria-label={video.title + " - watch on YouTube"} title={video.originalTitle}>
        <div className="video-image">
          <Image src={video.thumbnail} alt="" fill sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) 45vw, 30vw" className="video-thumbnail" />
          <span className="video-context">{video.context}</span>
          <span className="video-play" aria-hidden><Play size={18} fill="currentColor" /></span>
        </div>
        <div className="video-meta">
          <span>{video.category}</span>
          <span className="video-views"><TrendingUp size={13} aria-hidden />{video.viewLabel}</span>
        </div>
        <h3>{video.title}<ArrowUpRight size={19} aria-hidden /></h3>
        <p>{video.description}</p>
      </a>
    </article>
  );
}
