<template>
  <div class="w-100 h-100">
    <div class="w-100">
      <!-- <b-card
                img-src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                img-alt="" img-top tag="article" style="max-width: 20rem;" class="mb-2 mx-auto">
                <b-card-title>
                    {{user.name || user.email}}
                </b-card-title>
                <b-list-group flush>
                    <b-list-group-item>
                        <strong>Email: </strong> {{user.email}}
                    </b-list-group-item>
                    <b-list-group-item>
                        <strong>Username: </strong> {{user.username}}
                    </b-list-group-item>
                </b-list-group>
      </b-card>-->

      <b-card
        img-src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
        img-alt
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
      >
        <b-card-title>{{user.name || user.email}}</b-card-title>
        <b-list-group flush>
          <b-list-group-item d-flex justify-content-between>
            <strong>Email:</strong>
            {{user.email}}
          </b-list-group-item>
          <b-list-group-item>
            <strong>Username:</strong>
            {{user.username}}
          </b-list-group-item>
          <b-list-group-item>
            <strong>Password:</strong>
            <b-button :to="{name: 'change-password'}" pill variant="outline-secondary ml-2">Change</b-button>
          </b-list-group-item>
          <b-list-group-item>
            <strong>Admin:</strong>
            {{user.is_staff ? 'Yes' : 'No'}}
          </b-list-group-item>
          <b-list-group-item>
            <strong>Groups:</strong>
            {{myGroups.join(", ")}}
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </div>
  </div>
</template>

<script>
import HandleErrors from "@/utilities/handle-errors";

import BaseDialogMixin from "@/components/mixins/BaseDialogMixin.vue";
import BaseAlertMixin from "@/components/mixins/BaseAlertMixin.vue";

import { mapActions, mapState } from "vuex";

export default {
  mixins: [BaseDialogMixin, BaseAlertMixin],
  computed: {
    ...mapState("user", ["user", "myGroups"])
  },
  mounted: function() {
    let that = this;

    if (!that.user.email) {
      that.showLoadingDialog("Fetching information!");

      that
        .getUser()
        .then(response => {
          that.setUser(response.data);
        })
        .catch(error => {
          HandleErrors.HandleErrors(error);
        })
        .finally(() => {
          that.hideLoadingDialog();
        });
    }

    that
      .getMyGroups()
      .then(response => {
        that.setMyGroups(response.data);
      })
      .catch(error => {
        HandleErrors.HandleErrors(error);
      });
  },
  methods: {
    ...mapActions("user", ["setUser", "getUser", "getMyGroups", "setMyGroups"])
  }
};
</script>

<style>
</style>