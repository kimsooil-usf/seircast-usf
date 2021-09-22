<template>
  <div>
    <b-card header-tag="nav" class="border-0">
      <b-card-text>
        <h6 class="tw-font-bolder tw-mb-0">{{ title }}</h6>
        <p class="text-secondary tw-text-xs">{{ region }}</p>
        <Highcharts :options="options"></Highcharts>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>

export default {
  props: {
    title: String,
    axisTitle: String,
    capacity: Number,
    seriesTitle: String,
    counties: {
      type: Array,
      default: () => []
    },
    forecast: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const self = this;
    return {
      options: {
        title: {
          text: undefined
        },

        yAxis: {
          title: {
            text: this.axisTitle
          }
        },
        tooltip: {
          valueDecimals: 0
        },

        xAxis: {
          title: {
            text: 'Date'
          },
          type: 'datetime',
          accessibility: {
            rangeDescription: 'Range: 2010 to 2017'
          }
        },

        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: Date.UTC(2020, 4, 1),
            pointInterval: 24 * 3600 * 1000 // one day
          }
        },

        series: [
          {
            type: 'areaspline',
            name: this.seriesTitle,
            marker: {
              enabled: false
            },
            data: this.forecast,
            events: {
              afterAnimate: function () {
                this.yAxis.addPlotLine({
                  value: self.capacity,
                  color: 'red',
                  dashStyle: 'shortdash',
                  width: 2,
                  label: {
                    text: `Capacity - ${self.capacity}`,
                    style: {
                      color: 'red'
                    }
                  }
                });
              }
            }
          }
        ],

        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        },

        credits: {
          enabled: false
        }
      }
    };
  },
  computed: {
    region () {
      if (this.counties.length > 1) {
        return `${this.counties.join(', ')} Counties`;
      } else if (this.counties.length) {
        return `${this.counties.join()} County`;
      }
      return 'All Counties';
    }
  }
};
</script>

<style>
nav.card-header {
  border-bottom: none;
  padding: 0.5rem 0 0 0;
}
ul.nav.nav-tabs {
  padding: 0 0.5rem;
}
ul.nav.nav-tabs li.nav-item {
  font-size: 0.7rem;
}
ul.nav.nav-tabs a.nav-link {
  padding: 0.35rem 0.5rem;
}
</style>
