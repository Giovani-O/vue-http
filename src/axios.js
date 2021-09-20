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

    config.headers.common['Authorization'] = `Bearer token_jwt`
    config.headers.put['My Header'] = 'Curso VueJS'
    return config

    // return new Promise((resolve, reject) => {
    //     console.log('Fazendo requisição...')
    //     setTimeout(() => {
    //         console.log('Enviando requisição')
    //         resolve(config)
    //     }, 2000)
    // })
}, error => {
    console.log('Erro ao fazer requisição: ', error)
    return Promise.reject(error)
})

instance.interceptors.response.use(response => {
    console.log('interceptando resposta...', response)
    if(Array.isArray(response.data)) {
        response.data = response.data.slice(1, 3)
    }
    return response
}, error => {
    console.log('Erro interceptado: ', error)
    return Promise.reject(error)
})

export default instance