class Cache {
    save(key, value){
        sessionStorage.setItem(key, JSON.stringify(value))
    }

    get(key){
        return JSON.parse(sessionStorage.getItem(key))
    }

    includes(key){
        if(sessionStorage.getItem(key)){
            return true
        } else {
            return false
        }
    }
}

export const cache = new Cache()

