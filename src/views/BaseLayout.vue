<template>
  <div>
    <div class="w-full h-16">
      <div class="navbar shadow-md">
        <div class="navbar-start">
          <div class="dropdown">
            <label class="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabindex="0"
              class="
                mt-3
                p-2
                shadow
                menu menu-compact
                dropdown-content
                bg-base-100
                rounded-box
                w-52
              "
            >
              <li><a>Homepage</a></li>
              <li><a>Portfolio</a></li>
              <li><a>About</a></li>
            </ul>
          </div>
        </div>
        <div class="navbar-center">
          <a class="btn btn-ghost normal-case text-xl">NAAAG</a>
        </div>
        <div class="navbar-end">
          <button class="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button class="btn btn-ghost btn-circle">
            <div class="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span class="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div class="flex body">
      <div class="w-60 border-r">
        <ul class="menu w-full mt-5">
          <li :class="{ bordered: $route.name == 'Dashboard' }">
            <router-link :to="{ name: 'Dashboard' }">Dashboard</router-link>
          </li>
          <li :class="{ bordered: $route.path.includes('/ui/gateway') }">
            <router-link :to="{ name: 'Gateway' }">Gateway</router-link>
          </li>
          <li :class="{ bordered: $route.path.includes('/ui/configs') }">
            <router-link :to="{ name: 'Parameter' }">Configs</router-link>
          </li>
          <div class="ml-1" v-if="$route.path.includes('/ui/configs')">
            <ul class="menu menu-compact w-full">
              <li :class="{ bordered: $route.name == 'Parameter' }">
                <router-link :to="{ name: 'Parameter' }">Parameter</router-link>
              </li>
              <li :class="{ bordered: $route.name == 'Site' }">
                <router-link :to="{ name: 'Site' }">Site</router-link>
              </li>
              <li :class="{ bordered: $route.name == 'Server' }">
                <router-link :to="{ name: 'Server' }">Server</router-link>
              </li>
              <li :class="{ bordered: $route.name == 'Location' }">
                <router-link :to="{ name: 'Location' }">Location</router-link>
              </li>
              <li :class="{ bordered: $route.name == 'Upstream' }">
                <router-link :to="{ name: 'Upstream' }">Upstream</router-link>
              </li>
            </ul>
          </div>
        </ul>
      </div>
      <div class="flex-1 relative pb-24 text-left">
        <div class="p-5">
          <slot name="body"></slot>
        </div>
        <div class="h-24 absolute bottom-0 left-0 w-full border-t-2">
          <footer
            class="h-24 p-4 footer text-base-content footer-center"
          >
            <div>
              <p>
                Copyright © 2022 - All right reserved by Universe Tech Ltd
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body {
  min-height: calc(100vh - 64px);
}

</style>