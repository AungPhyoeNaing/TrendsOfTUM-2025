import newsIcon from "/assets/images/news.png";
import memesIcon from "/assets/images/memes.png";
import enterIcon from "/assets/images/tv.png";
import studyIcon from "/assets/images/study.png";
import announceIcon from "/assets/images/announce.png";

const CATEGORIES = [
    { id: "news", name: "News", icon: newsIcon },
    { id: "memes", name: "Memes", icon: memesIcon },
    { id: "entertainment", name: "Entertainment", icon: enterIcon },
    { id: "study", name: "Study", icon: studyIcon },
    { id: "announcement", name: "Announcement", icon: announceIcon },
    // Note: 'All' is typically a frontend filter option, not a stored category
];

export default CATEGORIES;
