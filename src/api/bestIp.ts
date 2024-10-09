import createAxios from '@/utils/axios'

export const url = '/api/db/bestips/'

export default  class bestIp {
     static list(data: anyObj) {
        return createAxios(
            {
                url: url + 'list',
                method: 'get',
            },
            {
                showSuccessMessage: true,
            }
        )
    }
    static update(data: anyObj) {
        return createAxios(
            {
                url: url + 'update',
                method: 'post',
                data: data,
                dataType: 'text'
            },
            {
                showSuccessMessage: true,
            }
        )
    }
}
