import axios from 'axios'
import config from './config/config'

const instance = axios.create({})

instance.defaults.baseURL = config.apiURL

instance.interceptors.request.use(config => {
    console.log('Interceptando requisição: ', config)
    config.data = {
        ...config.data,
        curso: 'VueJS'
    }
    // return config
    return new Promise((resolve, reject) => {
        console.log('Fazendo requisição...')
        setTimeout(() => {
            console.log('Enviando requisição')
            resolve(config)
        }, 2000)
    })
}, error => {
    console.log('Erro ao fazer requisição: ', error)
    return Promise.reject(error)
})

export default instance