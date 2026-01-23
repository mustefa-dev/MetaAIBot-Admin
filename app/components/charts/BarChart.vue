<template>
  <ClientOnly>
    <apexchart
      type="bar"
      :height="height"
      :options="chartOptions"
      :series="series"
    />
    <template #fallback>
      <div :style="{ height: `${height}px` }" class="flex items-center justify-center">
        <UiSpinner />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
interface Props {
  series: { name: string; data: number[] }[]
  categories: string[]
  height?: number
  colors?: string[]
  title?: string
  horizontal?: boolean
  showLegend?: boolean
  showGrid?: boolean
  stacked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 350,
  horizontal: false,
  showLegend: true,
  showGrid: true,
  stacked: false
})

const themeStore = useThemeStore()

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
    background: 'transparent',
    stacked: props.stacked
  },
  colors: props.colors || ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'],
  plotOptions: {
    bar: {
      horizontal: props.horizontal,
      borderRadius: 4,
      columnWidth: '60%',
      barHeight: '60%'
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: props.categories,
    labels: {
      style: {
        colors: themeStore.isDark ? '#9ca3af' : '#6b7280',
        fontSize: '12px'
      }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: {
        colors: themeStore.isDark ? '#9ca3af' : '#6b7280',
        fontSize: '12px'
      }
    }
  },
  grid: {
    show: props.showGrid,
    borderColor: themeStore.isDark ? '#374151' : '#e5e7eb',
    strokeDashArray: 4
  },
  legend: {
    show: props.showLegend,
    position: 'top',
    horizontalAlign: 'right',
    labels: {
      colors: themeStore.isDark ? '#9ca3af' : '#6b7280'
    }
  },
  tooltip: {
    theme: themeStore.isDark ? 'dark' : 'light'
  },
  title: props.title ? {
    text: props.title,
    style: {
      color: themeStore.isDark ? '#ffffff' : '#111827',
      fontSize: '16px',
      fontWeight: '600'
    }
  } : undefined
}))
</script>
