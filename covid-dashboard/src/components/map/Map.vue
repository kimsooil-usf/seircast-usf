<template>
  <Highmaps class="hm-height" :options="mapOptions" :key="selectedRegion"/>
</template>

<script>

import {
  mapGetters,
  // mapActions,
  // mapMutations
} from 'vuex';

export default {
  mixins: [],
  components: {
  },
  props: {
    selectedRegion: String,
    mapData: Object
  },
  data: function() {
    return {
    };
  },
  computed: {
    ...mapGetters('covid', ['getMetadata', 'getPredictionsAllCounties', 'getSelectedRegion']),
    mapOptions () {
      const self = this;
      let predictionsAllCounties = self.getPredictionsAllCounties;
      // Check if state is Missouri
      if (self.getSelectedRegion === 'Missouri') {
        // Filter out Kansas City as a county
        const excludedCounties = [
          'Kansas City'
        ]
        predictionsAllCounties = predictionsAllCounties.filter(entry => !excludedCounties.includes(entry.Locations))
      }
      const options = {
        chart: {
          map: self.mapData
        },
        title: {
          text: undefined
        },
        credits: {
          enabled: false
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          title: {
            text: 'Confirmed Cases'
          }
        },
        colorAxis: {
          min: 0,
          minColor: '#E6E7E8',
          maxColor: '#cc1e02'
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        series: [{
          name: 'Confirmed Cases',
          data: predictionsAllCounties.map(entry => {
            // Pad FIPS code with zero if shorter than expected
            const fips = entry.FIPS.toString().length < 5 ? `0${entry.FIPS}` : entry.FIPS.toString();
            const feature = self.mapData.features.find(feature => feature.properties.fips === fips);
            const confirmed = entry.Confirmed.slice(-1)[0];
            const modelFailed = entry.model_status === 'model failed';
            const asterisks = ['*', '*', '*'];
            return {
              ['hc-key']: feature.properties['hc-key'],
              value: confirmed,
              infectious: modelFailed ? asterisks : entry.I_confirmed_yesterday.map(item => Math.trunc(item)),
              undetected: modelFailed ? asterisks : entry.I_undetected_yesterday.map(item => Math.trunc(item)),
              infectious_expected: modelFailed ? asterisks : entry.daily_cases_yesterday.map(item => Math.trunc(item)),
              undetected_expected: modelFailed ? asterisks : entry.daily_undetected_yesterday.map(item => Math.trunc(item))
            };
          }),
          dataLabels: {
            enabled: true,
            color: '#FFFFFF',
            formatter: function () {
              return this.point.name;
            }
          },
          tooltip: {
            headerFormat: undefined,
            pointFormatter: function () {
              const header = `<b>${this.name}</b> ${this.value}<br/>`;
              const infectious = `Active Infectious Cases Detected: ${this.infectious[1]} (<span style="color: #c53030">▲${this.infectious[2]}</span>  <span style="color: #2b6cb0">▼${this.infectious[0]}</span>)`;
              const undetected = `Active Infectious Cases Undetected: ${this.undetected[1]} (<span style="color: #c53030">▲${this.undetected[2]}</span>  <span style="color: #2b6cb0">▼${this.undetected[0]}</span>)`;
              const infectious_expected = `New Infectious Cases Detected: ${this.infectious_expected[1]} (<span style="color: #c53030">▲${this.infectious_expected[2]}</span>  <span style="color: #2b6cb0">▼${this.infectious_expected[0]}</span>)`;
              const undetected_expected = `New Infectious Cases Undetected: ${this.undetected_expected[1]} (<span style="color: #c53030">▲${this.undetected_expected[2]}</span>  <span style="color: #2b6cb0">▼${this.undetected_expected[0]}</span>)`;
              const body = `${infectious}<br/>${undetected}<br/>${infectious_expected}<br/>${undetected_expected}<br/>`;
              return `${header}${body}`;
            }
          }
        }],
        exporting: {
          buttons: {
            contextButton: {
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
            }
          }
        }
      };
      return options;
    }
  }
};
</script>

<style>
.hm-height {
  height: 48rem;
}
</style>