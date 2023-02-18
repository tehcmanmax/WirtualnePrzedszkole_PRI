import axios from 'axios'
import { config } from '../../AxiosUrlConfig';


const GROUP_REST_API_URL =  config.SERVER_URI + '/api/class'

class GroupService {
    
    getGroups(){
        return axios.get(GROUP_REST_API_URL)
    }

    addGroup(group){
        return axios.post(GROUP_REST_API_URL, group, {
            headers: {
              'Content-Type': 'application/json'
            }
            });
    }

    deleteGroup(id){
        return axios.delete(GROUP_REST_API_URL + '/' + id)
    }

    getGroup(id) {
        return axios.get(GROUP_REST_API_URL + '/' + id)
    }
}
// eslint-disable-next-line
export default new GroupService();
