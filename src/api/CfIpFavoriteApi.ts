import createAxios from '@/utils/axios'
import {h} from 'vue'
import {ElNotification} from "element-plus";

export const url = '/api/db/ip/favorite'

export default class CfIpFavoriteApi {
    static getBestIp() {
        return createAxios(
            {
                url: url + '/best',
                method: 'get',
            }
        )
    }

    static page(data: any) {
        return createAxios(
            {
                url: url + '/page',
                method: 'post',
                data: data
            }
        )
    }

    static list(data: any) {
        return createAxios(
            {
                url: url + '/list?limit=20',
                method: 'get',
            }
        )
    }

    static update(data: object, group: any, deleteOld: any) {
        return createAxios(
            {
                url: url + '/update?group=' + group + '&deleteOld=' + deleteOld,
                method: 'post',
                data: data
            }
        ).then(res => {
            console.log("响应", res)
            ElNotification({
                title: '更新提示',
                message: h('i', {style: 'color: teal'}, res.data),
            })
        })
    }

    static delete(ip: any) {
        return createAxios(
            {
                url: url + '/delete?ip=' + ip,
                method: 'post'
            }
        ).then(res => {
            ElNotification({
                title: '删除提示',
                message: h('i', {style: 'color: teal'}, res.data),
            })
            return res;
        })
    }
}
