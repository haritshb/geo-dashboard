<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const showMenu = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="user-menu">
    <button class="user-btn" @click="toggleMenu">
      👤 {{ authStore.user?.username || "User" }}
      ▼
    </button>

    <div v-if="showMenu" class="dropdown">
      <button class="dropdown-item" @click="logout">
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-menu {
  position: relative;
  z-index: 9999;
}

.user-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 6px;
}

.dropdown {
  position: absolute;
  top: 45px;
  right: 0;

  width: 180px;
  background: white;

  border: 1px solid #ddd;
  border-radius: 8px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  z-index: 10000; /* IMPORTANT */
}

.dropdown-item {
  width: 100%;
  padding: 12px;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f5f5f5;
}
</style>