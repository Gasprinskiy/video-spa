import Dexie from 'dexie';

export const db = new Dexie('myDatabase');

db.version(4).stores({
    browsingHistory: '++id, videoId, title, description, chanelname, publishedAt, preview',
    searchHistory: '++id, request',
    watchLaterPlaylist: '++id, videoId, title, description, chanelname, publishedAt, preview',
});

// title: data.about.snippet.title,
//         description: data.about.snippet.description,
//         chanelname: data.about.snippet.channelTitle,
//         publishedAt: data.about.snippet.publishedAt,
//         preview: data.about.snippet.thumbnails.medium.url,
//         views: data.statistics.viewCount,