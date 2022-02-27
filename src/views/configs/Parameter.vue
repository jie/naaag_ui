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
            <div class="btn btn-primary" @click="onClickNewParameter">
              New Parameter
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <!-- head -->
            <thead>
              <tr>
                <th>Key</th>
                <th>type</th>
                <th>default</th>
                <th>options</th>
                <th>category</th>
                <th>Remarks</th>
                <th>Create At</th>
                <th>Operate</th>
              </tr>
            </thead>
            <tbody>
              <!-- row 1 -->
              <tr
                v-for="item in pagination.data"
                :key="item.id"
                class="border-b"
              >
                <th>{{ item.key }}</th>
                <td>{{ item.type }}</td>
                <td style="max-width: 60px; overflow-x: hidden">
                  {{ item.default }}
                </td>
                <td style="max-width: 60px; overflow-x: hidden">
                  >{{ item.options.length === 0 ? "" : item.options }}
                </td>
                <td>{{ item.category }}</td>
                <td>{{ item.remark }}</td>
                <td>{{ item.create_at }}</td>
                <td>
                  <button
                    class="btn btn-primary btn-sm mr-1"
                    @click="edit(item)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-sm btn-error text-white"
                    @click="chooseDeleteItem(item)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-center p-5">
          <Pagination
            v-on:change-page="onPageChange"
            :page="pagination.page"
            :total_page="pagination.total_page"
          />
        </div>
        <ParameterForm
          :parameter="currentParameter"
          v-on:save-parameter-form="onSaveParameterForm"
          v-on:close-parameter-form="onCloseParameterForm"
        />
        <div :class="{modal: true, 'modal-open': deleteItemId?true:false}">
          <div class="modal-box">
            <h3 class="font-bold text-lg">
              Notice
            </h3>
            <p class="py-4">
              Wether to delete current item
            </p>
            <div class="modal-action">
              <button class="btn btn-sm btn-primary" @click="deleteItem">Confirm</button>
              <button class="btn btn-sm btn-outline" @click="onCancelDeleteItem">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import BaseLayout from "@/views/BaseLayout.vue";
import API from "../../services/http_service.js";
import Pagination from "@/components/Pagination.vue";
import ParameterForm from "@/components/ParameterForm.vue";
export default defineComponent({
  setup() {},
  components: {
    BaseLayout,
    Pagination,
    ParameterForm,
  },
  data() {
    return {
      currentParameter: "",
      pagination: {
        data: [],
        keyword: "",
        page: 1,
        pagesize: 20,
        total: 0,
        total_page: 0,
      },
      deleteItemId: false
    };
  },
  created() {
    this.getEntites();
  },
  methods: {
    async getEntites() {
      let api = new API("/naaag/api/parameter/parameter/list");
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
    onPageChange(e) {
      this.pagination.page = e.page;
      this.getEntites();
    },
    edit(item) {
      this.currentParameter = item;
    },
    onCancelDeleteItem() {
      this.deleteItemId = false
    },
    chooseDeleteItem(item) {
      this.deleteItemId = item.id
    },
    async deleteItem() {
      let api = new API("/naaag/api/parameter/parameter/delete");
      let res = await api.request({
        id: this.deleteItemId 
      });
      if(res.status) {
        this.getEntites()
      }
      this.deleteItemId = ""
    },
    onCloseParameterForm() {
      this.currentParameter = "";
    },
    onClickNewParameter() {
      this.currentParameter = {
        key: "",
        type: "",
        options: [],
        default: "",
        category: "",
        multiple: false,
      };
    },
    async onSaveParameterForm(e) {
      let api;
      let res;
      if (e.parameter && e.parameter.id) {
        api = new API("/naaag/api/parameter/parameter/update");
        res = await api.request({
          id: e.parameter.id,
          entity: {
            key: e.parameter.key,
            type: e.parameter.type,
            options: e.parameter.options,
            default: e.parameter.default,
            category: e.parameter.category,
            multiple: e.parameter.multiple,
          },
        });
      } else {
        api = new API("/naaag/api/parameter/parameter/create");
        console.log(e);
        res = await api.request({
          entity: e.parameter,
        });
      }

      if (res.status) {
        this.currentParameter = "";
        this.getEntites();
      }
    },
  },
});
</script>
