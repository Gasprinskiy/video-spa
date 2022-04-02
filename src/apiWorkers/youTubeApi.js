import axios from 'axios'

const apiUrl = 'https://www.googleapis.com/youtube/v3';
const apiKeys = {
    key1:'AIzaSyBWlj8NYVMXRmu8K-VVVrsxmwbfBf1Yrak',
    key2: 'AIzaSyCz3FXHsEIcBmW4rl4nf1BNO6Z3rUm_E_c',
    key3: 'AIzaSyCyrUrGROj3G0xHi5cOJDko68DIMv9W6n4',
    key4: 'AIzaSyAmzDULEWUlMd63TDcW015O3Gy_paIoVDU'
}


export const youTubesearch = async(options) => {
        return axios.get(apiUrl + '/search', {
            params: {
                key: apiKeys.key1,
                part: "snippet",
                type: "video",
                order: options.sort,
                q: options.request,
                maxResults: options.maxResult,
            }
        })
}

export const fullVideoData = async (options) => {
    return axios.get(apiUrl + '/videos', {
        params: {
            part: apiKeys.key2,
            id: options.videoId,
            key: newApiKey,
        }
    })
}

export const mostPopularVideo = async (options) => {
    return axios.get(apiUrl + '/videos', {
        params: {
            part: 'snippet',
            chart: 'mostPopular',
            key: apiKeys.key3,
            maxResults: options.maxResult,
        }
    })
}

export const similarVideo = async (options) => {
    return axios.get(apiUrl + '/search', {
        params: {
            key: apiKeys.key4,
            part: "snippet",
            type: "video",
            relatedToVideoId: options.videoId,
            maxResults: options.maxResult,
        }
    })
}

