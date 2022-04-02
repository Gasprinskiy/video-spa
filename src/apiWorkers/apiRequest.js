import { 
    youTubesearch, 
    similarVideo,
    fullVideoData, 
    mostPopularVideo 
} from "./youTubeApi.js";

import { 
    cacheData, 
    returnFromCache, 
    isCacheIncludes,
    videoListToUnifiedView,
    videoToUnifiedView
 } from '../helpers/myHelpers.js'

export const apiRequest = async (callBack, options) => {
    const isInCache = isCacheIncludes(options.request)
    let result = []
    if (isInCache) {
        result = returnFromCache(options.request)
        console.log('data came from cache');
    } else {
        await callBack(options)
            .then(response => {
                result = response
                if((result instanceof Error) === false){
                    cacheData(options.request, result)
                    console.log('data came from server'); 
                }
            }) 
    }
    return result
}


export const searchVideo = async (options) => {
    const result = await callBackCaller(youTubesearch, options);
    return videoListToUnifiedView(result)
}

export const getMostPopularVideo = async (options) => {
    const result = await callBackCaller(mostPopularVideo, options);
    return videoListToUnifiedView(result)
}

export const getRecomendationVideo = async (options) => {
    const requestOptions = {
        videoId: options.videoId,
        maxResult: options.maxResult
    }
    const result = await callBackCaller(similarVideo, requestOptions)
    console.log(result);
    return videoListToUnifiedView(result)
}

export const getVideoFullData = async (options) => {
    let result = {};
    let requestOptions = {
        videoId: options.request,
        part: 'snippet',
        maxResult: options.maxResult
    }
    await callBackCaller(fullVideoData, requestOptions)
        .then(response =>{
            if(isResponseError(response)){
                result = response
            } else {
                result.about = response[0]
                requestOptions.part = 'statistics'
            }
        })
    await callBackCaller(fullVideoData, requestOptions)
            .then(response => {
                if(isResponseError(response)){
                    result = response
                } else {
                    result.statistics = response[0].statistics
                }
            })
    await callBackCaller(similarVideo, requestOptions)
            .then(response => {
                if(isResponseError(response)){
                    result = response
                } else {
                    result.similarVideo = response
                }
            })
    return videoToUnifiedView(result)
}


export const callBackCaller = async (callBack, options) => {
    let result;
    try {
        await callBack(options)
            .then(response => {
                result = response.data.items
            }) 
    } catch(e){
        result = e
    }  
    return result
}

export const isResponseError = (response) => {
    const isError = response instanceof Error;
    if(isError){
        return true
    } else {
        return false
    }
}