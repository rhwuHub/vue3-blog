<template>
  <div class="password-container">
    <h2>Enter Password</h2>
    <input
        type="password"
        v-model="password"
        @keyup.enter="checkPassword"
        placeholder="Enter password"
        class="password-input"
    />
    <button @click="checkPassword" class="submit-button">Submit</button>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMainStore } from '@/store/store.ts';

export default {
  setup() {
    const password = ref('');
    const error = ref('');
    const router = useRouter();
    const route = useRoute();
    const store = useMainStore();

    const checkPassword = () => {
      const correctPassword = '123456';  // 这里设置你的密码
      if (password.value === correctPassword) {
        store.passwordVerified = true;
        router.push(route.query.redirect || '/editor');
      } else {
        error.value = 'Incorrect password';
      }
    };

    return {
      password,
      error,
      checkPassword
    };
  }
};
</script>

<style scoped>
.password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: rgb(70, 100, 180);
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.password-input {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message {
  margin-top: 10px;
  color: red;
}
</style>
