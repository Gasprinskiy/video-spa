import { db } from '../dexie'

export const dbRequestCaller = async (callBack, options) => {
    let result = {
        data: null,
        hasError: false
    };
    try {
        await callBack(options)
            .then(resp => {
                result.data = resp
            })
    } catch (e){
        result.hasError = true
        result.errorMessage = e.message
    }
    return result
}

export const getDataFromDb = async ({target}) => {
    return await db[target].
        reverse()
        .toArray()
}

export const getDataFromDbWithLimit = async ({target, limit, offset = 0}) => {
    return await db[target].
        reverse()
        .offset(offset)
        .limit(limit)
        .toArray()
}

export const getDbTotalCount = async ({target}) => {
    return await db[target].count()
}


export const getDataFromDbById = async ({target, id}) => {
    return await db[target].get(id)
}

export const getFilteredDataFromDb = async ({target, filterOptions}) => {
    return await db[target]
    .filter(filterOptions)
    .toArray()
}

export const searchByValInDb = async ({target, where, val}) =>{
    return await db[target]
      .where(where)
      .startsWith(val)
      .toArray()
}

export const addDataToDb = async ({target, payload}) => {
    return await db[target].add(payload)
}

export const putDataToDb = async ({target, payload}) => {
    return await db[target].put(payload)
}

export const removeDataFromDb = async ({target, id}) => {
    return await db[target]
        .delete(id)
}


