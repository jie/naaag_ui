<template>
  <BaseLayout>
    <template #body>
      <div>
       <div class="search-bar">
          <div class="flex-1">
            <div class="input-group">
              <input
                type="text"
                placeholder="Search…"
                v-model="pagination.keyword"
                class="input input-bordered w-80"
              />
              <button class="btn btn-square" @click="getEntites">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
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
            </div>
          </div>
          <div class="w-80 flex justify-end">
            <div class="btn btn-primary" @click="onClickNewGateway">
              New Gateway
            </div>
          </div>
        </div>

        <div class="h-full pt-20" v-if="pagination.data.length == 0">
          <div class="hero h-full">
            <div class="text-center hero-content">
              <div class="max-w-lg">
                <h1 class="text-3xl font-bold">Create a API Gateway</h1>
                <p class="py-6">
                  Currently you do not have any API Gateway, click belowing
                  button to get start.
                </p>
                <button class="btn btn-primary" @click="onClickNewGateway">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap" v-else>
          <div
            class="card w-60 bg-base-100 shadow-xl border-2 mr-5"
            :key="entity.uid"
            v-for="entity in pagination.data"
          >
            <figure @click="edit(entity)" class="h-32 flex items-center justify-center">
              <svg
                width="64"
                height="64"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" fill="white" fill-opacity="0.01" />
                <rect
                  x="4"
                  y="34"
                  width="8"
                  height="8"
                  fill="#2F88FF"
                  stroke="#333"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="8"
                  y="6"
                  width="32"
                  height="12"
                  fill="#2F88FF"
                  stroke="#333"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 34V18"
                  stroke="#333"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 34V26H40V34"
                  stroke="#333"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="36"
                  y="34"
                  width="8"
                  height="8"
                  fill="#2F88FF"
                  stroke="#333"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="20"
                  y="34"
                  width="8"
                  height="8"
                  fill="#2F88FF"
                  stroke="#333"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 12H16"
                  stroke="#FFF"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </figure>
            <div class="card-body">
              <h2 class="card-title">
                {{ entity.name }}
                <div class="badge badge-info">Gateway</div>
              </h2>
              <p>{{ entity.remark }}</p>
              <div class="justify-end card-actions">
                <div class="badge badge-primary cursor-pointer" @click="edit(entity)">View</div>
                <div class="badge badge-error text-white cursor-pointer">Delete</div>
              </div>
            </div>
          </div>
        </div>
        <GatewayForm
          :gateway="currentGateway"
          v-on:save-gateway-form="onSaveGatewayForm"
          v-on:close-gateway-form="onCloseGatewayForm"
        />
      </div>
    </template>
  </BaseLayout>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import BaseLayout from "./BaseLayout.vue";
import GatewayForm from "@/components/GatewayForm.vue";
import API from "@/services/http_service";
import { IconPark } from "@icon-park/vue-next/es/all";

export default defineComponent({
  setup() {},
  components: {
    BaseLayout,
    GatewayForm,
    IconPark,
  },
  data() {
    return {
      currentGateway: "",
      pagination: {
        data: [],
        keyword: "",
        page: 1,
        pagesize: 20,
        total: 0,
        total_page: 0,
      },
      entities: [],
    };
  },
  created() {
    this.getEntites();
  },
  methods: {
    onClickNewGateway() {
      this.currentGateway = {
        name: "",
        remark: "",
        remark_en: "",
      };
    },
    async saveGateway(gateway) {
      let api = new API("/naaag/api/gateway/create");
      let res = await api.request({
        entity: gateway,
      });
    },
    async onSaveGatewayForm(e) {
      console.log(e.gateway);
      await this.saveGateway(e.gateway);
      this.currentGateway = "";
    },
    onCloseGatewayForm() {
      this.currentGateway = "";
    },
    async getEntites() {
      let api = new API("/naaag/api/gateway/list");
      let res = await api.request({
        page: this.pagination.page,
        pagesize: this.pagination.pagesize,
        keyword: this.pagination.keyword,
      });
      if (res.status) {
        this.pagination = res.data;
      }
      this.$forceUpdate();
    },
    edit(entity) {
      console.log(entity)
      console.log(entity.uid)
      this.$router.push({
        name: 'GatewayDetail',
        params: {
          uid: entity.uid
        }
      })
    }
  },
});
</script>
