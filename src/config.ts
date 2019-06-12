const env = process.env.NODE_ENV ? process.env.NODE_ENV : ''

let url :any = {
    'development':'development',
    'dev':'ssss',
    'production':'production',
}

export default {
    url:url[env],
    src:url[env],
}