<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// import { useAuthStore } from "@/stores/authStore";
import { useAuthStore } from "../stores/authStore";

const username = ref("");
const password = ref("");

const authStore = useAuthStore();
const router = useRouter();

const submit = async () => {
  try {

    await authStore.login(
      username.value,
      password.value
    );

    router.push("/");

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Login failed"
    );
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Geo Dashboard</h1>
      <p class="subtitle">Sign in to continue</p>

      <input
        v-model="username"
        placeholder="Username"
        class="input"
      />

      <input
        type="password"
        v-model="password"
        placeholder="Password"
        class="input"
      />

      <button
        class="login-btn"
        @click="submit"
      >
        Login
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(
    135deg,
    #0f172a,
    #1e293b
  );
}

.login-card {
  width: 400px;
  padding: 40px;

  background: white;
  border-radius: 16px;

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.15);

  display: flex;
  flex-direction: column;
}

.login-card h1 {
  margin: 0;
  text-align: center;
  color: #1e293b;
}

.subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 24px;
}

.input {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 16px;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  font-size: 14px;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #2563eb;

  box-shadow:
    0 0 0 3px rgba(37, 99, 235, 0.15);
}

.login-btn {
  width: 100%;
  padding: 12px;

  border: none;
  border-radius: 8px;

  background: #2563eb;
  color: white;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.login-btn:hover {
  background: #1d4ed8;
}

.login-btn:active {
  transform: scale(0.98);
}
</style>