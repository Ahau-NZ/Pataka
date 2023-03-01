<template>
  <Dialog :show="show" :title="title" @close="close" width="720px" :goBack="close" enableMenu>
    <!-- Content Slot -->
    <template v-slot:content>
      <v-col class="py-0">
        <ProfileForm :profile.sync="formData" :mobile="mobile" />
      </v-col>
    </template>
    <!-- End Content Slot -->

    <!-- Actions Slot -->
    <template v-slot:actions style="border: 2px solid orange;">
      <v-btn @click="close" text large fab class="secondary--text">
        <span color="secondary">cancel</span>
      </v-btn>
      <v-btn @click="submit" text large fab class="blue--text ml-5">
        <span>save</span>
      </v-btn>
    </template>
    <!-- End Actions Slot -->
  </Dialog>
</template>

<script>
import Dialog from '@/components/Dialog.vue'
import ProfileForm from '@/components/ProfileForm.vue'
import isEmpty from 'lodash.isempty'

function setDefaultData () {
  const formData = {
    id: '',
    preferredName: '',
    avatarImage: {},
    description: ''
  }

  return formData
}

export default {
  name: 'NewNodeDialog',
  components: {
    Dialog,
    ProfileForm
  },
  props: {
    show: { type: Boolean, required: true },
    title: { type: String, default: 'Create a new Pātaka' }
  },
  data () {
    return {
      formData: setDefaultData()
    }
  },
  computed: {
    mobile () {
      return this.$vuetify.breakpoint.xs
    },
    submission () {
      const submission = {}
      Object.entries(this.formData).forEach(([key, value]) => {
        if (!isEmpty(this.formData[key])) submission[key] = value
      })

      return submission
    }
  },
  methods: {
    submit () {
      if (this.submission && !this.submission.preferredName) return
      this.$emit('create', this.submission)
      this.close()
    },
    close () {
      this.resetFormData()
      this.$emit('close')
    },
    resetFormData () {
      this.formData = setDefaultData()
    }

  }
}
</script>

<style scoped>
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
</style>
