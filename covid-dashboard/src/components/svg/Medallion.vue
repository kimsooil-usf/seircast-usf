<template>
    <svg height="175" width="175">
        <g>
            <circle cx="85" cy="85" r="70"></circle>
            <text class="text-state" x="40" y="120">{{ state }}</text>
            <text class="text-title" x="21" y="110">{{ title.split('').join(' ') }}</text>
        </g>
    </svg>
</template>

<script>
export default {
  props: {
    title: String,
    state: String,
    small: Boolean
  },
  name: "Medallion"
}
</script>

<style scoped>
circle {
    fill: #F7A35C;
}
.text-state {
    font-size: 6.5rem;
    font-weight: 600;
    transform: scale(.9,1);
    color: #343434;
}
.text-title {
    font-family: Helvetica Neue, Arial, sans-serif;
    font-size: 1.2rem;
    fill: #FFFFFF;
    transform: scale(1,.85);
    /*letter-spacing: 6px;*/ /* TODO no support for this setting in older browsers. Falling back to spaces. */
}
</style>