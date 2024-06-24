<template>
	<div>
		<div class="logo">
			<h1>My Site</h1>
		</div>
		<nav class="flex justify-center">
			<ul class="flex space-x-4">
				<li><router-link to="/">Home</router-link></li>
				<li><router-link to="/about">About</router-link></li>
				<li><router-link to="/contact">Contact</router-link></li>
			</ul>
		</nav>
		<ColorMode />
	</div>
</template>
<script setup lang="ts">
import ColorMode from './util/ColorMode.vue';

</script>