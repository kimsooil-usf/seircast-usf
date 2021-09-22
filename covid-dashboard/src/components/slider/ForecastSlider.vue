<template>
    <b-card class="mb-1">
        <b-card-text >
            <h6 class="tw-font-bolder tw-mb-0 mb-1">Forecast Length</h6>
            <p class="text-secondary tw-text-xs mb-1">{{ value }} days</p>
            <b-row>
                <b-col>
                    <b-input-group size="sm" prepend="0" :append="`${maximumDays}`">
                        <b-input
                                size="sm"
                                type="range"
                                min="0"
                                :max="maximumDays"
                                step="1"
                                number
                                debounce="250"
                                :value="value"
                                @update="$emit('input', $event)"
                        ></b-input>
                    </b-input-group>
                </b-col>
            </b-row>
        </b-card-text>
    </b-card>
</template>

<script>

export default {
  props: {
    maximumDays: Number,
    value: Number
  }
}

</script>

<style scoped>

</style>