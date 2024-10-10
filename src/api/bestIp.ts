import createAxios from '@/utils/axios'

export const url = '/api/db/bestips/'

export default  class bestIp {
     static list(data: any) {
        return createAxios(
            {
                url: url + 'list',
                method: 'get',
            }
        )
    }
    static update(data: object) {
        return createAxios(
            {
                url: url + 'update',
                method: 'post',
                data: data
            }
        )
    }
}
