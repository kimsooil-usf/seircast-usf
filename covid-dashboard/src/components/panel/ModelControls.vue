<template>
    <b-card class="mb-1">
        <b-row>
            <b-col>
                <b-row class="mb-2">
                    <b-col>
                        <b-button @click="$emit('button-clicked')" block size="sm" variant="primary" :disabled="disableButton">
                            <span v-if="disableButton">Select Counties</span>
                            <span v-else>Update Charts</span>
                        </b-button>
                    </b-col>
                </b-row>
                <!-- <h6 class="tw-font-bolder tw-mb-0 pt-3 mb-1">Lockdown Release</h6> -->
                <!-- <p class="text-secondary tw-text-xs mb-1">Lockdown strength: {{ value.lockdown_strength }}</p>
                <b-row class="mb-2">
                    <b-col>
                        <b-input-group size="sm" prepend="0" append="1">
                            <b-input
                                    size="sm"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    number
                                    :value="value.lockdown_strength"
                                    @input="updateValue('lockdown_strength', $event)"
                            ></b-input>
                        </b-input-group>
                    </b-col>
                </b-row> -->
                <!-- <b-row>
                    <b-col cols="2" class="text-secondary tw-text-lg my-auto pr-0">End:</b-col>
                    <b-col cols="10" class="pl-0">
                        <b-form-datepicker
                                ref="shelter_release_end_date"
                                locale="en-US"
                                size="sm"
                                class="mb-2"
                                :min="value.shelter_release_start_date"
                                :value="value.shelter_release_end_date"
                                @input="updateValue('shelter_release_end_date', $event)"
                        ></b-form-datepicker>
                    </b-col>
                </b-row> -->
                <h6 class="tw-font-bolder tw-mb-0 mb-1 pt-3">Social Distancing</h6>
                <!-- <p class="text-secondary tw-text-xs mb-1">Social distancing strength: {{ value.social_distancing_strength }}</p>
                <b-row>
                    <b-col>
                        <b-input-group size="sm" prepend="0" append="1">
                            <b-input
                                    size="sm"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    number
                                    :value="value.social_distancing_strength"
                                    @input="updateValue('social_distancing_strength', $event)"
                            ></b-input>
                        </b-input-group>
                    </b-col>
                </b-row> -->
                <b-checkbox
                        ref="social_distancing"
                        :checked="value.social_distancing"
                        @input="updateValue('social_distancing', $event)"
                        class="text-secondary tw-text-xs my-2"
                >Enable social distancing end</b-checkbox>
                <b-row>
                    <b-col cols="2" class="text-secondary tw-text-lg my-auto pr-0">End:</b-col>
                    <b-col cols="10" class="pl-0">
                        <b-form-datepicker
                                ref="social_distancing_end_date"
                                locale="en-US"
                                size="sm"
                                class="mb-2"
                                :min="value.shelter_release_start_date"
                                :value="value.social_distancing_end_date"
                                @input="updateValue('social_distancing_end_date', $event)"
                        ></b-form-datepicker>
                    </b-col>
                </b-row>
                <!-- <h6 class="tw-font-bolder tw-mb-0 mb-1 pt-3">Quarantined</h6>
                <p class="text-secondary tw-text-xs mb-1">Percentage of population quarantined</p>
                <b-form-radio-group
                        ref="quarantine_percent"
                        class="mb-2"
                        :checked="value.quarantine_percent"
                        @input="updateValue('quarantine_percent', $event)"
                        :options="quarantine_percent_options"
                ></b-form-radio-group>
                <b-row>
                    <b-col cols="2" class="text-secondary tw-text-lg my-auto pr-0">Start:</b-col>
                    <b-col cols="10" class="pl-0">
                        <b-form-datepicker
                                ref="quarantine_start_date"
                                locale="en-US"
                                size="sm"
                                class="mb-2"
                                :min="value.shelter_release_start_date"
                                :value="value.quarantine_start_date"
                                @input="updateValue('quarantine_start_date', $event)"
                        ></b-form-datepicker>
                    </b-col>
                </b-row> -->
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    disableButton: Boolean
  },
  data () {
    return {
      quarantine_percent_options: [
        {
          text: '0 %',
          value: 0
        },
        {
          text: '25 %',
          value: 25
        },
        {
          text: '50 %',
          value: 50
        },
        {
          text: '75 %',
          value: 75
        }
      ]
    };
  },
  methods: {
    updateValue (key, value) {
      this.$emit('input', {
        ...this.value, [key]: value
      });
    }
  }
}
</script>

<style scoped>

</style>