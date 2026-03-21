<template>
  <div ref="chartRef" class="ability-chart" :style="{ height: '100%', width: '100%' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import * as echarts from 'echarts';

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [
      { interview: 1, ability: 60 },
      { interview: 2, ability: 65 },
      { interview: 3, ability: 75 },
      { interview: 4, ability: 72 },
      { interview: 5, ability: 85 },
      { interview: 6, ability: 90 },
    ],
  },
});

const chartRef = ref(null);
let chartInstance = null;

const initChart = () => {
  if (!chartRef.value) return;

  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echarts.init(chartRef.value, null, {
    renderer: 'canvas' // 指定渲染器
  });

  const option = {
    // 标题配置
    title: {
      text: '',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },

    // 提示框配置
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#409eff',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      formatter: function(params) {
        const param = params[0];
        return `${param.name}次面试<br/>能力值: ${param.value}`;
      },
      extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.2); border-radius: 4px;'
    },

    // 图例配置
    legend: {
      show: true,
      top: '5%',
      right: '5%',
      itemWidth: 15,
      itemHeight: 15,
      textStyle: {
        fontSize: 12
      }
    },

    // 坐标轴配置
    xAxis: {
      type: 'category',
      name: '面试次数',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      },
      data: props.chartData.map(item => item.interview),
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisTick: {
        alignWithLabel: true,
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        interval: 0
      },
      splitLine: {
        show: false
      }
    },

    yAxis: {
      type: 'value',
      name: '能力值',
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      },
      min: 0,
      max: 100,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#f0f0f0'],
          type: 'dashed'
        }
      }
    },

    // 系列数据配置
    series: [
      {
        name: '能力成长',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: props.chartData.map(item => ({
          value: item.ability,
          itemStyle: {
            color: '#409eff'
          }
        })),
        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#66b1ff' }
          ])
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff',
          color: '#409eff'
        },
        areaStyle: {
          opacity: 0.3,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.4)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ])
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: '#f56c6c',
            borderWidth: 3
          }
        }
      }
    ],

    // 网格配置
    grid: {
      left: '8%',
      right: '5%',
      top: '15%',
      bottom: '10%',
      containLabel: true
    }
  };

  chartInstance.setOption(option, true); // 第二个参数表示是否不合并，直接替换
};

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeChart);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});

watch(
  () => props.chartData,
  () => {
    initChart();
  },
  { deep: true }
);

if (chartRef.value) {
  useResizeObserver(chartRef, resizeChart);
}
</script>

<style scoped>
.ability-chart {
  min-height: 220px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.ability-chart:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
