const echartOption = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    title: {
      display: false,
      text: ''
    },
    tooltip: {
      itemSort: function (a, b) {
        return b.formattedValue - a.formattedValue
      },
    }
  }
}
export { echartOption }