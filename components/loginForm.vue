<template>
	<div :class="['overlay', { active: active }]">
		<div class="container">
			<div class="close" @click="closeoverlay()">Close</div>
			<form class="login-form" @submit.prevent>
				<fieldset>
					<label for="user-email">Email</label>
					<input
						id="user-email"
						v-model="userInfo.username"
						class="p-2"
						type="email"
						required
					/>
					<label for="user-password">Password</label>
					<input
						v-model="userInfo.password"
						class="p-2"
						type="password"
						required
					/>
					<button
						:disabled="processing"
						@click="submitform(userInfo)"
					>
						Login
					</button>
					<div class="login-message">{{ message }}</div>
				</fieldset>
			</form>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		active: {
			type: Boolean,
			default: false
		},
		closeoverlay: {
			type: Function,
			required: true
		},
		message: {
			type: String,
			default: ''
		},
		processing: {
			type: Boolean,
			default: false
		},
		submitform: {
			type: Function,
			required: true
		}
	},
	data() {
		return {
			userInfo: {
				username: '',
				password: ''
			}
		}
	}
}
</script>

<style lang="postcss">
.close {
	color: var(--yellow);
	cursor: pointer;
	position: absolute;
	right: 0.5rem;
	top: 0.5rem;
}
.login-form {
	margin: 0 auto;
	max-width: 30rem;
	padding: 1rem;
	input {
		background: transparent;
		border: 1px solid var(--yellow);
		display: block;
		outline-color: var(--yellow);
		margin-bottom: 1rem;
		width: 100%;
	}
	button {
		margin-top: 1rem;
	}
}
.overlay {
	align-items: center;
	background-color: rgba(0, 0, 0, 0.9);
	bottom: 0;
	display: flex;
	height: 100%;
	left: 0;
	opacity: 0;
	pointer-events: none;
	position: fixed;
	right: 0;
	top: 0;
	transition: 400ms;
	width: 100%;
	z-index: -1;
	.container {
		flex: 1;
	}
	&.active {
		opacity: 1;
		pointer-events: auto;
		z-index: 99;
	}
}
.login-message {
	color: var(--red);
	font-weight: 700;
	margin-top: 1.5rem;
}
</style>
