// Verified against YouTube on 2026-09-09. Evidence: docs/channel-research.md.
// Short display titles are editorial; originalTitle preserves source metadata.
export const channel = {
  name: "Tech Caller",
  creator: "Rohit Rathore",
  handle: "@RealFunrr",
  url: "https://www.youtube.com/@RealFunrr",
  videosUrl: "https://www.youtube.com/@RealFunrr/videos",
  streamsUrl: "https://www.youtube.com/@RealFunrr/streams",
  playlistsUrl: "https://www.youtube.com/@RealFunrr/playlists",
  avatar: "/channel/avatar.jpg",
  banner: "/channel/banner.jpg",
  introduction: "Practical tech tutorials, gadget unboxings, and gaming. From figuring things out to trying something new, this is Tech Caller by Rohit Rathore.",
  topics: ["Practical technology", "Gadget unboxings", "Gaming & streams"],
  featuredVideos: [
    {
      id: "qmXMTrrjvCk",
      title: "On the road in Indian Truck Simulator",
      originalTitle: "Indian Truck Driving | Truck Driving India Simulator | Indian Truck Simulator LIVE\uD83D\uDD34",
      url: "https://www.youtube.com/watch?v=qmXMTrrjvCk",
      thumbnail: "/channel/truck-simulator.jpg",
      category: "GAMING",
      context: "Stream replay",
      date: "2026-09-05",
      dateLabel: "5 Sep 2026",
      description: "Take a seat for a simulator stream from the channel."
    },
    {
      id: "dlKlh1zLiQM",
      title: "How to make a PDF on Android",
      originalTitle: "Pdf Kaise Banaye | How To Make PDF in Android | How To Create PDF in Android | Real Fun rr",
      url: "https://www.youtube.com/watch?v=dlKlh1zLiQM",
      thumbnail: "/channel/android-pdf.jpg",
      category: "TECH TUTORIAL",
      context: "From the archive",
      date: "2020-09-20",
      dateLabel: "20 Sep 2020",
      description: "An Android how-to from the tutorial archive."
    },
    {
      id: "d-xIBDgn2ek",
      title: "Redmi Note 9: the unboxing",
      originalTitle: "Redmi Note 9 Unboxing | Redmi Note 9 Unboxing in Hindi | Redmi Note 9 (6GB Ram 128GB) | Real fun rr",
      url: "https://www.youtube.com/watch?v=d-xIBDgn2ek",
      thumbnail: "/channel/redmi-note-9.jpg",
      category: "UNBOXING",
      context: "From the archive",
      date: null,
      dateLabel: "Archive",
      description: "A closer look at the Redmi Note 9, in Hindi."
    }
  ],
  playlist: {
    title: "Rohit's Tech Videos",
    originalTitle: "Rohit's Tech Videos\uD83E\uDD18",
    url: "https://www.youtube.com/playlist?list=PLYEG2CzNqryQn72XEaDaMavhht_6iL3vG",
    description: "A mixed collection from the channel's tech and gaming archive."
  }
} as const;
