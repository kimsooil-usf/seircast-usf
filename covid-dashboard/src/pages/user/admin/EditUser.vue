<template>
  <div class="w-100 h-100">
    <b-container class="tw-min-w-full">
      <b-row>
        <b-col cols="auto">
          <b-card
            img-src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
            img-alt
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2 mx-auto"
          >
            <b-card-title>{{currentUser.name || currentUser.email}}</b-card-title>
            <b-list-group flush>
              <b-list-group-item>
                <strong>Email:</strong>
                {{currentUser.email}}
              </b-list-group-item>
              <b-list-group-item>
                <strong>Username:</strong>
                {{currentUser.username}}
              </b-list-group-item>
              <b-list-group-item>
                <strong>Admine:</strong>
                {{currentUser.is_staff ? 'Yes' : 'No'}}
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
        <b-col cols="auto" sm="4">
          <b-list-group>
            <b-list-group-item
              v-for="(group, index) in groups"
              :key="group.id"
              class="d-flex justify-content-between align-items-center"
            >
              {{index}} - {{group.name}}
              <b-form-checkbox
                :id="'checkbox-' + index"
                v-model="groups[index].selected"
                :name="'checkbox-' + index"
                :value="true"
                :unchecked-value="false"
                @change="addRemoveGroup(index)"
                size="lg"
              ></b-form-checkbox>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { HTTP } from "@/utilities/http-common";
import HandleErrors from "@/utilities/handle-errors";

import _ from "lodash";

import DashboardBaseTemplate from "@/layouts/DashboardBaseTemplate.vue";

import { mapActions } from "vuex";

export default {
  mixins: [DashboardBaseTemplate],
  data: function() {
    return {
      fields: [{ key: "" }, { key: "options" }],
      status: true,
      groups: [],
      currentUser: {},
      myGroups: []
    };
  },
  computed: {},
  mounted: function() {
    let that = this;

    that.showLoadingDialog("Fetching information!");

    HTTP.get("/users/api/admin-users/" + that.$route.params.userId)
      .then(response => {
        that.currentUser = response.data;
      })
      .catch(error => {
        HandleErrors.HandleErrors(error);
      })
      .finally(() => {
        that.hideLoadingDialog();
      });

    HTTP.get(
      "/users/api/admin-user-group/?user_id=" + that.$route.params.userId
    )
      .then(myGroupsResponse => {
        that.myGroups = myGroupsResponse.data;

        HTTP.get("/users/api/admin-groups/")
          .then(response => {
            that.groups = response.data;
            _.each(that.groups, function(item, index) {
              if (_.indexOf(that.myGroups, that.groups[index].name) > -1) {
                that.groups[index].selected = true;
              } else {
                that.groups[index].selected = false;
              }
            });
          })
          .catch(error => {
            HandleErrors.HandleErrors(error);
          });
      })
      .catch(error => {
        HandleErrors.HandleErrors(error);
      });
  },
  methods: {
    ...mapActions("user", ["setUser", "getUser", "getMyGroups", "setMyGroups"]),
    addRemoveGroup: function(index) {
      let that = this;

      if (that.groups[index].selected) {
        HTTP.delete(
          "/users/api/admin-user-group/1/?group_id=" +
            that.groups[index].id +
            "&user_id=" +
            that.$route.params.userId
        )
          .then(() => {
            that.$notify({
              text: "Group removed!",
              duration: 10000,
              type: "success"
            });
          })
          .catch(error => {
            HandleErrors.HandleErrors(error);
          });
      } else {
        HTTP.post("/users/api/admin-user-group/", {
          user_id: that.$route.params.userId,
          group_id: that.groups[index].id
        })
          .then(() => {
            that.$notify({
              text: "Group added!",
              duration: 10000,
              type: "success"
            });
          })
          .catch(error => {
            HandleErrors.HandleErrors(error);
          });
      }
    }
  }
};
</script>

<style>
</style>