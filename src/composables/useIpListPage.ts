import { reactive, ref, onUnmounted } from 'vue'

/**
 * IP 列表页通用逻辑:查询条件、分页、自动刷新、加载状态。
 * 供 ip/list.vue 与 favorite/list.vue 复用,消除重复代码。
 */
export function useIpListPage(fetchPage: (query: any) => Promise<any>) {
	const pageVO = reactive({
		total: 10,
		pageIndex: 1,
		pageSize: 10
	})

	const queryData = reactive({
		name: '',
		group: '',
		status: '',
		countryCode: '',
		countryNameCN: '',
		reachable: '',
		ip: '',
		delay1: '',
		delay2: '',
		speed1: '',
		speed2: '',
		countryCodeIsNull: false
	})

	const loading = ref(false)
	const bestIpList = ref([])
	const autoRefresh = ref(false)
	const seconds = ref(3)

	fetchIpList()

	let interval: ReturnType<typeof setInterval> = setInterval(() => {
		if (autoRefresh.value && !loading.value) {
			fetchIpList()
		}
	}, seconds.value * 1000)

	onUnmounted(() => {
		if (interval) {
			clearInterval(interval)
		}
	})

	function check() {
		clearInterval(interval)
		seconds.value = seconds.value < 1 ? 1 : seconds.value
		interval = setInterval(() => {
			if (autoRefresh.value && !loading.value) {
				fetchIpList()
			}
		}, seconds.value * 1000)
	}

	function search() {
		pageVO.pageIndex = 1
		fetchIpList()
	}

	function reset() {
		queryData.name = ''
		queryData.group = ''
		queryData.status = ''
		queryData.countryCode = ''
		queryData.countryNameCN = ''
		queryData.reachable = ''
		queryData.ip = ''
		queryData.delay1 = ''
		queryData.delay2 = ''
		queryData.speed1 = ''
		queryData.speed2 = ''
		queryData.countryCodeIsNull = false
		pageVO.pageIndex = 1
		fetchIpList()
	}

	function fetchIpList() {
		loading.value = true
		fetchPage({
			data: queryData,
			pageVO: pageVO
		}).then(res => {
			bestIpList.value = res.data.data
			pageVO.total = res.data.total
			loading.value = false
		}).catch(() => {
			loading.value = false
		})
	}

	return {
		pageVO,
		queryData,
		loading,
		bestIpList,
		autoRefresh,
		seconds,
		check,
		search,
		reset,
		fetchIpList,
		// 模板里 @page-change="getIpList" 使用的别名
		getIpList: fetchIpList
	}
}
