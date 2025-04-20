import axios from "axios";

export const getOrdersAdmin = async (token) => {
    return axios.get('http://shop-main-api.vercel.app/api/admin/orders', {
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}

export const changeStatus = async (token,orderId,orderStatus) => {
    return axios.put('http://shop-main-api.vercel.app/api/admin/order-status', {
        orderId,orderStatus
    }, {
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getListAllUsers = async (token) => {
    return axios.get('http://shop-main-api.vercel.app/api/users', {
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}

export const changeUserStatus = async (token,value) => {
    return axios.post('http://shop-main-api.vercel.app/api/change-status', value,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}

export const changeUserRole= async (token,value) => {
    return axios.post('http://shop-main-api.vercel.app/api/change-role', value,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}