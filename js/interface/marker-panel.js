Fliplet.InteractiveMap.component('marker-panel', {
  componentName: 'Marker Panel',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'fa fa-circle'
    },
    color: {
      type: String,
      default: '#337ab7'
    },
    size: {
      type: String,
      default: '24px'
    },
    type: {
      type: String,
      default: 'marker-panel'
    },
    isFromNew: {
      type: Boolean,
      default: true
    },
    emptyIconNotification: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      widgetInstanceId: Fliplet.Widget.getDefaultId(),
      dataSourceId: Fliplet.Widget.getData().markersDataSourceId,
      updateDebounced: _.debounce(this.updateDataSource, 1000),
      entries: undefined,
      columns: undefined,
      dataSourceConnection: undefined,
      oldStyleName: ''
    }
  },
  methods: {
    onInputData() {
      const componentData = _.pick(this, ['id', 'name', 'icon', 'color', 'size', 'type', 'isFromNew'])
      Fliplet.InteractiveMap.emit('marker-panel-settings-changed', componentData)
    },
    updateDataSource() {
      Fliplet.DataSources.connect(this.dataSourceId).then(connection => {
        this.dataSourceConnection = connection
        connection.find({where: {['Marker style']: this.oldStyleName}}).then(records => {
          if (!records.length) {
            return
          }

          this.dataSourceConnection.find().then(records => {
            records.forEach((elem, index, array) => {
              if (elem.data['Marker style'] === this.oldStyleName) {
                array[index].data['Marker style'] = this.name
              }
            })

            this.entries = records
            this.columns = _.keys(records[0].data)
            this.dataSourceConnection.commit(this.entries, this.columns)
            this.oldStyleName = this.name
            Fliplet.Studio.emit('reload-widget-instance', this.widgetInstanceId)
          })
        })
      })
    },
    getStyleName() {
      this.oldStyleName = this.name
    },
    openIconPicker() {
      this.icon = this.icon || ''

      Fliplet.Widget.toggleCancelButton(false)

      window.iconPickerProvider = Fliplet.Widget.open('com.fliplet.icon-selector', {
        // Also send the data I have locally, so that
        // the interface gets repopulated with the same stuff
        data: this.icon,
        // Events fired from the provider
        onEvent: (event, data) => {
          if (event === 'interface-validate') {
            Fliplet.Widget.toggleSaveButton(data.isValid === true)
          }
        }
      })

      Fliplet.Studio.emit('widget-save-label-update', {
        text: 'Select & Save'
      })

      window.iconPickerProvider.then((data) => {
        Fliplet.Widget.toggleCancelButton(true)
        if (!data.data.icon) {
          this.emptyIconNotification = true
        } else {
          this.icon = data.data.icon
          this.emptyIconNotification = false
        }

        this.onInputData();
        window.iconPickerProvider = null
        Fliplet.Studio.emit('widget-save-label-reset')
        return Promise.resolve()
      });
    }
  },
  created() {
    Fliplet.InteractiveMap.on('markers-save', this.onInputData)
  },
  destroyed() {
    Fliplet.InteractiveMap.off('markers-save', this.onInputData)
  },
  mounted() {
    const $vm = this
    const $colorpickerElement = $('#list-item-color-' + $vm.id).parents('[colorpicker-component]')

    $colorpickerElement.colorpicker({
      container: true,
      customClass: 'colorpicker-2x',
      sliders: {
        saturation: {
          maxLeft: 235,
          maxTop: 235
        },
        hue: {
          maxTop: 235
        },
        alpha: {
          maxTop: 235
        }
      }
    })

    $colorpickerElement.on('changeColor', (e) => {
      $vm.color = e.value
      $vm.onInputData()
    })

    $('#list-item-color-' + $vm.id).on('click', () => {
      $(this).prev('.input-group-addon').find('i').trigger('click')
    })

    $('.input-group-addon i').on('click', () => {
      $(this).parents('.input-group-addon').next('#list-item-color-' + $vm.id).trigger('focus')
    })
  }
});
