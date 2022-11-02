<template>
  <v-form ref="form" light class="px-4 pt-4">
    <v-row>
      <!-- Upload profile photo -->
      <v-col :order="mobile ? '' : '2'" class="pt-6">
        <v-row class="justify-center pt-3">
          <!-- Avatar -->
          <Avatar
            class="big-avatar"
            size="200px"
            type="pataka"
            :image="formData.avatarImage"
            :alt="formData.preferredName"
            :isView="false"
            @updateAvatar="formData.avatarImage = $event"
          />
        </v-row>
        <v-row>
          <!-- Upload Profile Photo Button -->
          <v-col cols="12" justify="center" align="center" class="pa-0">
            <ImagePicker
              @updateAvatar="formData.avatarImage = $event"
              :avatarLoaded="formData.avatarImage"
            />
          </v-col>
        </v-row>
      </v-col>

      <!-- Names -->
      <v-col cols="12" :sm="mobile ? '12' : '6'" class="pt-2">
        <v-row>
          <v-col cols="12" class="pa-1">
            <v-text-field
              v-model="formData.preferredName"
              label="Pātaka name" outlined
              :rules="nameRules"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <!-- Description textarea -->
          <v-col cols="12" class="pa-1">
            <v-textarea
              v-model="formData.description"
              label="Description"
              no-resize
              rows="5"
              auto-grow
              outlined
            ></v-textarea>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import Avatar from '@/components/Avatar.vue'
import ImagePicker from '@/components/ImagePicker.vue'

export default {
  name: 'ProfileForm',
  components: {
    Avatar,
    ImagePicker
  },
  props: {
    profile: { type: Object, required: true },
    mobile: { type: Boolean, default: false }
  },
  data () {
    return {
      formData: {},
      form: {
        valid: true,
        showDescription: false
      },
      nameRules: [v => !!v || 'Pataka name required']
    }
  },
  watch: {
    profile: {
      deep: true,
      immediate: true,
      handler (newVal) {
        this.formData = newVal
      }
    },
  }
}
</script>

<style scoped lang="scss">
.custom.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}
.custom.v-text-field > .v-input__control > .v-input__slot:after {
  border-style: none;
}
.close {
  top: -25px;
  right: -10px;
}
.big-avatar {
  position: relative;
  top: -20px;
}
.v-input--checkbox label {
  font-size: 14px;
}

.v-input--radio-group__input label {
  font-size: 14px;
}

.v-text-field input {
  text-align: center !important;
}

.text-field {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.8em;
  margin: 0;
}
</style>
