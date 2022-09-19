import axios from 'axios'


const CHILDREN_REST_API_URL = 'http://localhost:8080/api/child'

class ChildrenService {
    
    getChildren(){
        return axios.get(CHILDREN_REST_API_URL)
    }

    addChild(child){
        console.log(child)
        return axios.post(CHILDREN_REST_API_URL, child, {
            headers: {
              'Content-Type': 'application/json'
            }
            });
    }

    deleteChild(id){
        return axios.delete(CHILDREN_REST_API_URL + '/' + id)
    }

    getChild(id) {
        return axios.get(CHILDREN_REST_API_URL + '/' + id)
    }
}

export default new ChildrenService();