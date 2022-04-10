import { cache } from "@/cache/cacher.js";

export const cacheData = (key, value) => {
    cache.save(key, value)
}
export const returnFromCache = (key) => {
    return cache.get(key)
}
export const isCacheIncludes = (key) => {
    return cache.includes(key)
}

export const videoListToUnifiedView = (data) => {
    if(data instanceof Array){
       const unifiedView = [];
       data.forEach(elem => {
            let id;
            if(elem.id instanceof Object){
                id = elem.id.videoId
            } else {
                id = elem.id
            }
            if(elem.snippet){
                unifiedView.push({
                    videoId: id,
                    chanelname: elem.snippet.channelTitle,
                    title: elem.snippet.title,
                    description: elem.snippet.description,
                    preview: elem.snippet.thumbnails.medium.url,
                    publishedAt: elem.snippet.publishedAt
                })
            }
                
        });
        return unifiedView 
    } else {
        return data
    }
    
}

export const videoToUnifiedView = (data) => {
    return {
        videoId: data.about.id,
        url: `https://www.youtube.com/embed/${data.about.id}?autoplay=1`,
        title: data.about.snippet.title,
        description: data.about.snippet.description,
        chanelname: data.about.snippet.channelTitle,
        publishedAt: data.about.snippet.publishedAt,
        preview: data.about.snippet.thumbnails.medium.url,
        views: data.statistics.viewCount,
        similarVideoList: videoListToUnifiedView(data.similarVideo),
    }
}

export const definePublishedDay = (date) => {
    const sourceDate = date.split('T')
    const dateArray = sourceDate[0].split('-')
    const year = dateArray[0]
    const month = Number(dateArray[1].replace('0', ''))
    const publishedDay = `${defineMonth(month)} ${year} года`
    return publishedDay
}

export const isArrayEmpty = (array) => {
    if(array.length <= 0){
        return true
    } else {
        return false
    }
}

export const defineMonth = (month) => {
    switch(month){
        case 1: return 'январь'
        case 2: return 'февраль'
        case 3: return 'март'
        case 4: return 'апрель'
        case 5: return 'май'
        case 6: return 'июнь'
        case 7: return 'июль'
        case 8: return 'август'
        case 9: return 'сентябрь'
        case 10: return 'октябрь'
        case 11: return 'ноябрь'
        case 12: return 'декабрь'
    }
}

export const formatNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}



