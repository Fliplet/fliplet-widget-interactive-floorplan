Fliplet.InteractiveMap.component('map-panel', {
  componentName: 'Map Panel',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    image: {
      type: Object,
      default: undefined
    },
    type: {
      type: String,
      default: 'map-panel'
    },
    isFromNew: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onInputData() {
      const componentData = _.pick(this, ['id', 'name', 'image', 'type', 'isFromNew'])
      Fliplet.InteractiveMap.emit('map-panel-settings-changed', componentData)
    },
    openMapPicker() {
      const filePickerData = {
        selectFiles: this.image ? [this.image] : [],
        selectMultiple: false,
        type: 'image',
        fileExtension: ['JPG', 'JPEG', 'PNG', 'GIF', 'TIFF'],
        autoSelectOnUpload: true
      }

      window.filePickerProvider = Fliplet.Widget.open('com.fliplet.file-picker', {
        data: filePickerData,
        onEvent: (e, data) => {
          switch (e) {
            case 'widget-set-info':
              Fliplet.Studio.emit('widget-save-label-reset')
              Fliplet.Studio.emit('widget-save-label-update', {
                text: 'Select'
              })
              Fliplet.Widget.toggleSaveButton(!!data.length)
              break
          }
        }
      })

      window.filePickerProvider.then((result) => {
        this.image = result.data[0]
        this.onInputData()
        window.filePickerProvider = null
        Fliplet.Studio.emit('widget-save-label-reset')
        return Promise.resolve()
      })
    }
  },
  created() {
    Fliplet.InteractiveMap.on('maps-save', this.onInputData)
  },
  destroyed() {
    Fliplet.InteractiveMap.off('maps-save', this.onInputData)
  }
});