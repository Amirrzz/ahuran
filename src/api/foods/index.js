import { api } from "@/api/index.js"
let url = "/foods"
export const getFoodList = () => {
    return api.get(url).then(response => {
        //// do something before resolve 
        return response.data
    })
}
export const addFood = (food) => {
    return api.post(url, food).then(response => {
        return response
    })
}
export const updateFood = (food) => {
    const fullUrl = `${url}?id=${food.Id}`;
    return api.put(fullUrl, food).then(response => {
        return response
    })
}
export const deleteFood = (food) => {
    const fullUrl = `${url}?id=${food.Id}`;
    return api.delete(fullUrl).then(response => {
        return response
    })
}