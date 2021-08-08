const axios = require("axios")

const ApiService = {
    init(service){
        axios.default.defaults.baseURL=service
    },
    get(){},
    post: async(resource, data) => {
        return await axios.default.post(resource, data)
    },
    put(){},
    delete(){}
}

module.exports = ApiService