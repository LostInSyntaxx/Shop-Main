import axios from "axios";


export const createCategory = async (token,form) =>  {
    return axios.post('http://shop-main-api.vercel.app/api/category',form,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCategory = async () =>  {
    return axios.get('http://shop-main-api.vercel.app/api/category',)
}

export const removeCategory = async (token, id) =>  {
    return axios.delete('http://shop-main-api.vercel.app/api/category/'+id,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}