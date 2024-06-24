import { createMemoryHistory, createRouter } from 'vue-router'
import Index from '@/pages/Index.vue'

const routes = [
	{ path: '', component: Index },
	{ path: '/utilitydust', component: () => import('@/pages/UtilityDust.vue') },
]

export const router = createRouter({
	history: createMemoryHistory(),
	routes,
})