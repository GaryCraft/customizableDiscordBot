import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/Index.vue'

const routes = [
	{
		path: '/',
		component: Index,
		name: 'Index'
	},
	{
		path: '/utilitydust',
		component: () => import('@/pages/UtilityDust.vue'),
		name: 'utilitydust'
	},
]

export const router = createRouter({
	history: createWebHistory('/'),
	routes,
})