<template>
  <div>
    <v-col>
      <v-row justify="center">
        <v-hover v-slot="{ hover }">
          <v-avatar
            :size="size"
            :tile="tile"
            class="avatar-container"
            :class="{ isEditing: isEditing, online: !offline }"
            :dark="dark"
          >
            <v-img v-if="image && image.uri" :src="hackURL(image.uri)" :alt="alt" />
            <v-img v-else :src="getImage" class="no-pic" :style="customStyle"/>
            <v-overlay
              absolute
              opacity="0.5"
              :value="hover"
            >
              <p v-if="showLabel" class="text-center pt-2" style="font-size:12px">{{alt}}</p>
              <v-icon v-else-if="showEdit" @click="$emit('edit')">
                mdi-pencil
              </v-icon>
            </v-overlay>
          </v-avatar>
        </v-hover>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import avatarHelper from '@/lib/avatar-helpers.js'
// import ImagePicker from '@/components/ImagePicker.vue'

export default {
  name: 'Avatar',
  props: {
    showOnHover: Boolean,
    image: Object,
    alt: String,
    gender: String,
    type: { type: String, default: 'person' },
    size: { type: String, default: '25vh' },
    showLabel: { type: Boolean, default: false },
    showEdit: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },
    isEditing: { type: Boolean, default: false },
    offline: { type: Boolean, default: true },
    dark: Boolean,
    tile: Boolean
  },
  data: function () {
    return {
      hovered: false
    }
  },
  computed: {
    getImage () {
      return avatarHelper.defaultImage(this.type, this.gender || null)
    },
    customStyle () {
      return {
        opacity: this.offline ? 0.5 : 1
      }
    }
  },
  components: {
    // ImagePicker
  },
  methods: {
    // HACK 2021-08-09 - ideally the backend knows the correct host
    // currently it assumes localhost (see also ssb-serve-blobs/id-to-url)
    hackURL (url) {
      const u = new URL(url)
      u.hostname = window.location.hostname
      return u.href
    },
    updateAvatar (avatarImage) {
      this.$emit('updateAvatar', avatarImage)
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-container {
  position: relative;
  text-align: center;
}

.hoverName {
  position: relative;
  padding: 2px 5px;
  width: 200px;
  text-align: left;
  top: -10px;
  opacity: 0;
  z-index: 99;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.2);
}

.show {
  opacity: 1;
}
.isEditing {
  opacity: 0.2;
}
.online {
  border: 1px solid #4CAF50;
  box-shadow: 0 0 1px ;
  filter: drop-shadow(0 0 1px #4CAF50);
}

.no-pic {
  padding: 15px;
}

.avatar-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  backdrop-filter: opacity(0.1) blur(3px) saturate(5%);
  width: 100%;
  height: 100%;
}
</style>
