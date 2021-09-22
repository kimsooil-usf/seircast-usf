<template>
  <div>
    <b-card header-tag="nav" class="border-0">
      <b-card-text>
        <b-row>
          <b-col cols="5">
            <h6 class="tw-font-bolder tw-mb-0">{{ title }}</h6>
            <p class="text-secondary tw-text-xs">{{ region }}</p>
          </b-col>
          <b-col cols="7" class="border rounded bg-light">
            <slot name="help-content">
            </slot>
          </b-col>
        </b-row>
        <Highcharts :options="options"></Highcharts>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>

export default {
  props: {
    title: String,
    counties: {
      type: Array,
      default: () => []
    },
    reported: {
      type: Object,
      default: () => ({
        confirmed: []
      })
    },
    forecast: {
      type: Object,
      default: () => ({
        minimum: [],
        mean: [],
        maximum: []
      })
    },
    startDate: Number,
    helpText: String
  },
  data() {
    return {
      options: {
        title: {
          text: undefined
        },

        yAxis: {
          title: {
            text: this.title
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
            pointStart: this.startDate,
            pointInterval: 86400000 // 24 * 3600 * 1000 == one day
          }
        },

        series: [
        {
          type: 'arearange',
          name: 'Projected Minimum & Maximum',
          linkedTo: 'forecast_mean',
          color: '#f7a35c',
          fillOpacity: 0.5,
          marker: {
            enabled: false
          },
          data: this.forecast.minimum.map((minimum, index) => [ this.startDate + index * 86400000, minimum, this.forecast.maximum[index] ])
        },
        {
          id: 'forecast_mean',
          type: 'spline',
          name: 'Projected Median (95% confidence interval)',
          color: 'black',
          marker: {
            enabled: false
          },
          data: this.forecast.mean
        },
        {
          type: 'scatter',
          name: 'Confirmed cases (reported)',
          data: this.reported.confirmed,
          color: '#ba3c3d',
          marker: {
            symbol: 'circle'
          },
          tooltip: {
            headerFormat: '<span>{point.key}</span><br/>',
            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
          }
        }],

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
        },

        exporting: {
          buttons: {
            contextButton: {
              enabled: true,
              menuItems: [
                'printChart',
                'separator',
                'downloadPNG',
                'downloadJPEG',
                'downloadPDF',
                'downloadSVG'
              ],
              align: 'left',
              x: 75
            },
            toggleButton: {
              text: 'Linear',
              align: 'left',
              x: 105,
              theme: {
                fill: '#f0f0f0cc',
                stroke: '#e5e5e5'
              },
              onclick: function () {
                const svgElement = this.exportSVGElements[2];
                const text = svgElement.text.textStr;
                if (text === 'Linear') {
                  svgElement.attr({text: 'Logarithmic'});
                  this.yAxis[0].update({ type: 'logarithmic' });
                } else {
                  svgElement.attr({text: 'Linear'});
                  this.yAxis[0].update({ type: 'linear' });
                }
              }
            }
          }
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
.help-text {
  color: lightgray;
}
</style>
