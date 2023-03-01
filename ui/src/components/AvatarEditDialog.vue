<template>
  <Dialog title="Crop Photo" :show="show" width="750px" :goBack="close" enableMenu dark
    @submit="submit"
    @close="close"
  >
    <template v-slot:content>
      <v-row justify="center">
        <v-col style="max-width: 300px;">
          <clipper-fixed
            ref="avatar"
            :grid="false"
            :src="avatarImage"
            :area="100"
            :round="!tile"
            bg-color="rgba(0, 0, 0, 0)"
            shadow="rgba(0,0,0,0.5)"
            :rotate="rotation"
          />
        </v-col>
      </v-row>

      <div class="px-8 py-4">
        <h6 class="caption pt-8 white--text">
          <v-icon dark>mdi-gesture-tap</v-icon>
          Adjust the image by zooming, scaling and moving it around before
          saving.
        </h6>

        <h5 class="pt-8 white--text">rotate</h5>
        <clipper-range
          v-model="rotation"
          style="max-width: 300px"
          :min="0"
          :max="360"
        ></clipper-range>
      </div>
    </template>
  </Dialog>
</template>

<script>
import Dialog from '@/components/Dialog.vue'
import { makeFile, uploadFile } from '@/lib/file-helpers.js'

const MB = 1024 * 1024
const MAX_FILE_SIZE = 5 * MB

export default {
  name: 'AvatarEditDialog',
  components: {
    Dialog
  },
  props: {
    show: { type: Boolean, default: false },
    avatarImage: String,
    tile: Boolean
  },
  data () {
    return {
      rotation: 0
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    async submit () {
      try {
        const canvas = this.$refs.avatar.clip({
          maxWPixel: this.type === 'header' ? 1920 : 800
        })
        canvas.toBlob(async blob => {
          const file = makeFile(blob)

          if (file.size >= 5 * 1024 * 1024) {
            console.error('this avatar image is bigger than 5MB, we cannot allow this through, otherwise it will end up a hyperblob, which AvatarImage does not currently support')
            throw new Error('avatar image must me < 5MB')
          }

          const image = await this.uploadFile({ file, encrypt: true })

          if (image.mimeType === null) image.mimeType = file.type
          // TODO: HACK until mimeType: Hello World gets solved
          if (image.mimeType === 'Hello World') {
            image.mimeType = file.type
          }

          // NOTE: ssb-profile blobs uses blob.blob not blob.blobId (which are the artefact style)
          if (image.blobId) image.blob = image.blobId
          delete image.blobId

          const cleanImage = {}
          Object.entries(image).forEach(([key, value]) => {
            if (key === '__typename') return
            if (key === 'type') return
            cleanImage[key] = value
          })
          this.$emit('submit', cleanImage)
        })
      } catch (error) {
        console.error('Error editing avatar', error)
      }
    },
    async uploadFile (input) {
      try {
        if (input.file && input.file.size > MAX_FILE_SIZE) {
          throw new Error('Please check the file size is less than 5MB')
        }

        const res = await this.$apollo.mutate(
          uploadFile(input)
        )

        if (res.errors) throw res.errors

        return res.data.uploadFile
      } catch (err) {
        console.error('Something went wrong while trying to upload a file', err)
        return null
      }
    }
  }
}
</script>
